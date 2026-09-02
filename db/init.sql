CREATE TABLE IF NOT EXISTS agricultores (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  region TEXT NOT NULL,
  telefono TEXT,
  calificacion NUMERIC(3,2) DEFAULT 0,
  ventas INTEGER DEFAULT 0,
  avatar_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compradores (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publicaciones (
  id TEXT PRIMARY KEY,
  cultivo TEXT NOT NULL,
  variedad TEXT NOT NULL,
  cantidad NUMERIC(12,2) NOT NULL,
  unidad TEXT NOT NULL,
  precio NUMERIC(12,2) NOT NULL,
  calidad TEXT NOT NULL,
  region TEXT NOT NULL,
  distrito TEXT NOT NULL,
  fecha_cosecha DATE NOT NULL,
  descripcion TEXT,
  imagenes JSONB DEFAULT '[]'::jsonb,
  estado TEXT NOT NULL,
  agricultor_id TEXT REFERENCES agricultores(id),
  creada DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id TEXT PRIMARY KEY,
  publicacion_id TEXT NOT NULL,
  comprador_id TEXT REFERENCES compradores(id),
  comprador TEXT NOT NULL,
  comprador_email TEXT,
  comprador_telefono TEXT,
  comprador_region TEXT,
  cantidad NUMERIC(12,2) NOT NULL,
  precio_ofrecido NUMERIC(12,2) NOT NULL,
  mensaje TEXT,
  fecha_requerida DATE NOT NULL,
  estado TEXT NOT NULL,
  entrega JSONB,
  creada DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ventas (
  id TEXT PRIMARY KEY,
  publicacion_id TEXT NOT NULL,
  comprador TEXT NOT NULL,
  comprador_email TEXT,
  cantidad NUMERIC(12,2) NOT NULL,
  precio NUMERIC(12,2) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS puntos_acopio (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  region TEXT NOT NULL,
  provincia TEXT NOT NULL,
  distrito TEXT NOT NULL,
  lat NUMERIC(10,7) NOT NULL,
  lng NUMERIC(10,7) NOT NULL,
  horario TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO agricultores (id, nombre, region, telefono, calificacion, ventas, avatar_color)
VALUES
  ('ag-1', 'Julián Quispe', 'Huánuco', '+51 962 118 340', 4.8, 46, 'bg-primary'),
  ('ag-2', 'Rosa Ccahuana', 'Cusco', '+51 984 552 110', 4.9, 71, 'bg-earth'),
  ('ag-3', 'Cooperativa Valle Verde', 'La Libertad', '+51 944 220 987', 4.6, 128, 'bg-success')
ON CONFLICT (id) DO NOTHING;

INSERT INTO publicaciones (
  id, cultivo, variedad, cantidad, unidad, precio, calidad, region, distrito,
  fecha_cosecha, descripcion, imagenes, estado, agricultor_id, creada
)
VALUES
  (
    'pub-1',
    'papa',
    'Amarilla Tumbay',
    2400,
    'kg',
    2.6,
    'Primera',
    'Huánuco',
    'Chinchao',
    '2026-07-20',
    'Papa amarilla Tumbay recién cosechada.',
    '[]'::jsonb,
    'activa',
    'ag-1',
    '2026-07-22'
  ),
  (
    'pub-2',
    'palta',
    'Hass',
    5200,
    'kg',
    5.4,
    'Exportación',
    'La Libertad',
    'Virú',
    '2026-07-28',
    'Palta Hass de exportación.',
    '[]'::jsonb,
    'activa',
    'ag-3',
    '2026-07-29'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO solicitudes (
  id, publicacion_id, comprador, comprador_email, comprador_telefono, comprador_region,
  cantidad, precio_ofrecido, mensaje, fecha_requerida, estado, entrega, creada
)
VALUES
  (
    'sol-1',
    'pub-1',
    'Mercado Santa Anita',
    'comprador@kawsaytech.pe',
    '+51 987 654 321',
    'Lima',
    1200,
    2.45,
    'Necesitamos entrega en dos camionadas.',
    '2026-08-10',
    'pendiente',
    NULL,
    '2026-08-01'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO ventas (id, publicacion_id, comprador, comprador_email, cantidad, precio, fecha)
VALUES
  ('ven-1', 'pub-1', 'Distribuidora Los Andes', 'comprador@kawsaytech.pe', 1200, 3.1, '2026-06-25')
ON CONFLICT (id) DO NOTHING;

INSERT INTO puntos_acopio (
  id, nombre, direccion, region, provincia, distrito, lat, lng, horario
)
VALUES
  ('pa-1', 'Centro de Acopio Chinchao', 'Carretera Central km 32, mercado zonal', 'Huánuco', 'Huánuco', 'Chinchao', -9.6167, -76.0833, 'Lun a Sáb · 6:00 – 16:00'),
  ('pa-10', 'Hub Logístico Santa Anita', 'Gran Mercado Mayorista de Lima, Santa Anita', 'Lima', 'Lima', 'Santa Anita', -12.0533, -76.9497, 'Lun a Dom · 24 horas')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_publicaciones_agricultor ON publicaciones(agricultor_id);
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_publicacion ON solicitudes(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_ventas_publicacion ON ventas(publicacion_id);
