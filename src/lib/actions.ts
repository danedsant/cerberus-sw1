'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

// ==================== N8N HELPERS ====================

async function enviarN8n(evento: string, datos: Record<string, unknown>) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL no configurado, saltando notificación')
    return
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento, ...datos }),
    })
  } catch (error) {
    console.error('Error al enviar a n8n:', error)
  }
}

// ==================== USUARIOS ====================

export async function crearUsuario(formData: {
  email: string
  password: string
  nombre: string
  apellido: string
  cedula: string
  rol: string
  propiedad_id?: string
  telefono_contacto?: string
  turno?: string
}) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Crear en Supabase Auth (sin confirmación de email)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
  })

  if (authError) throw new Error('Error al crear usuario en auth: ' + authError.message)

  // 2. Insertar en tabla usuarios
  const { error: usuarioError } = await supabase
    .from('usuarios')
    .insert({
      id: authUser.user?.id,
      correo: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      cedula: formData.cedula,
      rol: formData.rol,
    })

  if (usuarioError) throw new Error('Error al crear usuario: ' + usuarioError.message)

  // 3. Si es residente, insertar en residentes
  if (formData.rol === 'residente' && formData.propiedad_id) {
    const { error: residenteError } = await supabase
      .from('residentes')
      .insert({
        usuario_id: authUser.user?.id,
        propiedad_id: formData.propiedad_id,
        telefono_contacto: formData.telefono_contacto,
      })

    if (residenteError) throw new Error('Error al crear residente: ' + residenteError.message)
  }

  // 4. Si es vigilante, insertar en vigilantes
  if (formData.rol === 'vigilante' && formData.turno) {
    const { error: vigilanteError } = await supabase
      .from('vigilantes')
      .insert({
        usuario_id: authUser.user?.id,
        turno: formData.turno,
      })

    if (vigilanteError) throw new Error('Error al crear vigilante: ' + vigilanteError.message)
  }

  // 5. Enviar email de bienvenida vía n8n
  await enviarN8n('bienvenida', {
    email: formData.email,
    nombre: formData.nombre,
    apellido: formData.apellido,
    rol: formData.rol,
    contrasena: formData.password,
  })

  revalidatePath('/admin/usuarios')
}

export async function actualizarUsuario(formData: {
  id: string
  nombre: string
  apellido: string
  cedula: string
  email: string
  rol: string
  propiedad_id?: string
  telefono_contacto?: string
  turno?: string
}) {
  const supabase = await createClient()

  // 1. Actualizar tabla usuarios
  const { error: usuarioError } = await supabase
    .from('usuarios')
    .update({
      nombre: formData.nombre,
      apellido: formData.apellido,
      cedula: formData.cedula,
      correo: formData.email,
    })
    .eq('id', formData.id)

  if (usuarioError) throw new Error('Error al actualizar usuario: ' + usuarioError.message)

  // 2. Si es residente, actualizar o insertar en residentes
  if (formData.rol === 'residente') {
    const { data: residenteExistente } = await supabase
      .from('residentes')
      .select('usuario_id')
      .eq('usuario_id', formData.id)
      .single()

    if (residenteExistente) {
      const { error: residenteError } = await supabase
        .from('residentes')
        .update({
          propiedad_id: formData.propiedad_id,
          telefono_contacto: formData.telefono_contacto,
        })
        .eq('usuario_id', formData.id)

      if (residenteError) throw new Error('Error al actualizar residente: ' + residenteError.message)
    } else {
      const { error: residenteError } = await supabase
        .from('residentes')
        .insert({
          usuario_id: formData.id,
          propiedad_id: formData.propiedad_id,
          telefono_contacto: formData.telefono_contacto,
        })

      if (residenteError) throw new Error('Error al crear residente: ' + residenteError.message)
    }
  }

  // 3. Si es vigilante, actualizar o insertar en vigilantes
  if (formData.rol === 'vigilante' && formData.turno) {
    const { data: vigilanteExistente } = await supabase
      .from('vigilantes')
      .select('usuario_id')
      .eq('usuario_id', formData.id)
      .single()

    if (vigilanteExistente) {
      const { error: vigilanteError } = await supabase
        .from('vigilantes')
        .update({ turno: formData.turno })
        .eq('usuario_id', formData.id)

      if (vigilanteError) throw new Error('Error al actualizar vigilante: ' + vigilanteError.message)
    } else {
      const { error: vigilanteError } = await supabase
        .from('vigilantes')
        .insert({
          usuario_id: formData.id,
          turno: formData.turno,
        })

      if (vigilanteError) throw new Error('Error al crear vigilante: ' + vigilanteError.message)
    }
  }

  revalidatePath('/admin/usuarios')
}

export async function eliminarUsuario(id: string) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Eliminar ingresos del residente (si es residente)
  await supabase.from('ingresos_residentes').delete().eq('residente_id', id)

  // 2. Eliminar visitas del residente (si es residente)
  await supabase.from('visitas').delete().eq('residente_id', id)

  // 3. Eliminar de auth (cascade eliminará usuarios y residentes/vigilantes)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (error) throw new Error('Error al eliminar usuario: ' + error.message)

  revalidatePath('/admin/usuarios')
}

// ==================== NOTIFICACIONES ====================

export async function notificarLlegadaVisita(visitaId: string) {
  const supabase = await createClient()

  // Obtener datos de la visita
  const { data: visita } = await supabase
    .from('visitas')
    .select(`
      id,
      tipo_visita,
      visitantes (nombre, apellido),
      residentes (
        usuarios (nombre, apellido, correo),
        propiedades (numero_unidad)
      )
    `)
    .eq('id', visitaId)
    .single()

  if (!visita) return

  const visitanteRaw = visita.visitantes as unknown as { nombre: string; apellido: string } | null
  const residenteRaw = visita.residentes as unknown as {
    usuarios: { nombre: string; apellido: string; correo: string }
    propiedades: { numero_unidad: string }
  } | null

  if (!residenteRaw || !visitanteRaw) return

  // Enviar notificación vía n8n
  await enviarN8n('llegada_visita', {
    email_residente: residenteRaw.usuarios.correo,
    nombre_residente: `${residenteRaw.usuarios.nombre} ${residenteRaw.usuarios.apellido}`,
    propiedad: residenteRaw.propiedades.numero_unidad,
    nombre_visitante: `${visitanteRaw.nombre} ${visitanteRaw.apellido}`,
    tipo_visita: visita.tipo_visita,
  })
}

// ==================== PROPIEDADES ====================

export async function crearPropiedad(numero_unidad: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('propiedades')
    .insert({ numero_unidad })

  if (error) throw new Error('Error al crear propiedad: ' + error.message)

  revalidatePath('/admin/propiedades')
}

export async function actualizarPropiedad(id: string, numero_unidad: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('propiedades')
    .update({ numero_unidad })
    .eq('id', id)

  if (error) throw new Error('Error al actualizar propiedad: ' + error.message)

  revalidatePath('/admin/propiedades')
}

export async function eliminarPropiedad(id: string) {
  const supabase = await createClient()

  // Verificar si tiene residentes asociados
  const { data: residentes } = await supabase
    .from('residentes')
    .select('usuario_id')
    .eq('propiedad_id', id)

  if (residentes && residentes.length > 0) {
    throw new Error('No se puede eliminar: la propiedad tiene residentes asociados')
  }

  const { error } = await supabase
    .from('propiedades')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Error al eliminar propiedad: ' + error.message)

  revalidatePath('/admin/propiedades')
}

// ==================== HISTORIAL ====================

export async function obtenerHistorial(filtros?: {
  fechaInicio?: string
  fechaFin?: string
  tipoVisita?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('visitas')
    .select(`
      id,
      fecha_esperada,
      fecha_creacion,
      fecha_hora_ingreso,
      tipo_visita,
      estado,
      codigo_pin,
      placa_vehiculo,
      residentes (
        usuario_id,
        usuarios (nombre, apellido),
        propiedades (numero_unidad)
      ),
      visitantes (nombre, apellido),
      vigilantes (
        usuarios (nombre, apellido)
      )
    `)
    .not('fecha_hora_ingreso', 'is', null)
    .order('fecha_hora_ingreso', { ascending: false })

  if (filtros?.fechaInicio) {
    query = query.gte('fecha_hora_ingreso', filtros.fechaInicio)
  }
  if (filtros?.fechaFin) {
    query = query.lte('fecha_hora_ingreso', filtros.fechaFin)
  }
  if (filtros?.tipoVisita) {
    query = query.eq('tipo_visita', filtros.tipoVisita)
  }

  const { data: visitas, error } = await query

  if (error) throw new Error('Error al obtener historial: ' + error.message)

  // Obtener ingresos de residentes
  let ingresosQuery = supabase
    .from('ingresos_residentes')
    .select(`
      id,
      fecha_hora,
      residentes (
        usuario_id,
        usuarios (nombre, apellido),
        propiedades (numero_unidad)
      ),
      vigilantes (
        usuarios (nombre, apellido)
      )
    `)
    .order('fecha_hora', { ascending: false })

  if (filtros?.fechaInicio) {
    ingresosQuery = ingresosQuery.gte('fecha_hora', filtros.fechaInicio)
  }
  if (filtros?.fechaFin) {
    ingresosQuery = ingresosQuery.lte('fecha_hora', filtros.fechaFin)
  }

  const { data: ingresos, error: ingresosError } = await ingresosQuery

  if (ingresosError) throw new Error('Error al obtener ingresos: ' + ingresosError.message)

  // Formatear y combinar resultados
  const historialVisitas = (visitas || []).map((v: Record<string, unknown>) => ({
    id: v.id,
    fecha: v.fecha_hora_ingreso || v.fecha_creacion,
    tipo: 'Visitante',
    tipoVisita: v.tipo_visita,
    persona: `${(v.visitantes as Record<string, string>)?.nombre} ${(v.visitantes as Record<string, string>)?.apellido}`,
    propiedad: `${(v.residentes as Record<string, Record<string, string>>)?.propiedades?.numero_unidad || ''}`,
    residente: `${(v.residentes as Record<string, Record<string, string>>)?.usuarios?.nombre} ${(v.residentes as Record<string, Record<string, string>>)?.usuarios?.apellido}`,
    vigilante: `${(v.vigilantes as Record<string, Record<string, string>>)?.usuarios?.nombre || 'N/A'} ${(v.vigilantes as Record<string, Record<string, string>>)?.usuarios?.apellido || ''}`,
    metodo: v.codigo_pin ? 'PIN' : 'QR',
    placa: v.placa_vehiculo,
    estado: v.estado,
  }))

  const historialResidentes = (ingresos || []).map((i: Record<string, unknown>) => ({
    id: i.id,
    fecha: i.fecha_hora,
    tipo: 'Residente',
    tipoVisita: 'residente',
    persona: `${(i.residentes as Record<string, Record<string, string>>)?.usuarios?.nombre} ${(i.residentes as Record<string, Record<string, string>>)?.usuarios?.apellido}`,
    propiedad: `${(i.residentes as Record<string, Record<string, string>>)?.propiedades?.numero_unidad || ''}`,
    residente: '',
    vigilante: `${(i.vigilantes as Record<string, Record<string, string>>)?.usuarios?.nombre || 'N/A'} ${(i.vigilantes as Record<string, Record<string, string>>)?.usuarios?.apellido || ''}`,
    metodo: 'QR Personal',
    placa: null,
    estado: 'ingresado',
  }))

  const historial = [...historialVisitas, ...historialResidentes].sort((a, b) => {
    const fechaA = a.fecha ? new Date(a.fecha as string).getTime() : 0
    const fechaB = b.fecha ? new Date(b.fecha as string).getTime() : 0
    return fechaB - fechaA
  })

  return historial
}
