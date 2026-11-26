-- Aplicada en Supabase (proyecto nutritseas) el 26/11/2026.
-- 1) ranking_clase: solo lectura y solo alumnos (antes se podía modificar perfiles a través de la vista)
create or replace view public.ranking_clase as
  select id, nombre, xp, nivel, racha
  from public.perfiles
  where estado = 'activo' and rol = 'alumno';
revoke all on public.ranking_clase from public, anon, authenticated;
grant select on public.ranking_clase to authenticated;

-- 2) fn_sumar_xp: solo alumnos activos y como máximo 60 XP por llamada (el quiz da 45 como mucho)
create or replace function public.fn_sumar_xp(p_xp integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_nuevo_xp integer;
begin
  if auth.uid() is null then raise exception 'Sin sesión'; end if;
  if p_xp is null or p_xp < 1 or p_xp > 60 then raise exception 'XP fuera de rango'; end if;
  if (select estado from public.perfiles where id = auth.uid()) is distinct from 'activo' then
    raise exception 'Cuenta no activa';
  end if;
  update public.perfiles
     set xp = xp + p_xp,
         nivel = least(20, greatest(1, ((xp + p_xp) / 100) + 1))
   where id = auth.uid()
  returning xp into v_nuevo_xp;
  return v_nuevo_xp;
end $$;

-- 3) Ninguna función de la app se puede llamar sin sesión
revoke execute on function public.fn_sumar_xp(integer) from public, anon;
revoke execute on function public.fn_aprobar_entrega(uuid, integer) from public, anon;
revoke execute on function public.fn_asignar_logro(uuid, uuid) from public, anon;
grant execute on function public.fn_sumar_xp(integer), public.fn_aprobar_entrega(uuid, integer), public.fn_asignar_logro(uuid, uuid) to authenticated;
