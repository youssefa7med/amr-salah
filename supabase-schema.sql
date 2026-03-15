-- Barber Shop Database Schema for Supabase

-- Clients Table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  birthday DATE,
  notes TEXT,
  totalVisits INTEGER DEFAULT 0,
  totalSpent DECIMAL(10, 2) DEFAULT 0,
  isVIP BOOLEAN DEFAULT FALSE,
  lastVisit DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nameAr VARCHAR(255) NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clientId UUID REFERENCES clients(id) ON DELETE SET NULL,
  clientName VARCHAR(255) NOT NULL,
  clientPhone VARCHAR(20),
  visitNumber INTEGER NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(5) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  discountType VARCHAR(20) DEFAULT 'fixed',
  total DECIMAL(10, 2) NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  barberId UUID,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Barbers Table
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  active BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_isVIP ON clients(isVIP);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_clientId ON transactions(clientId);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(active);

-- Enable Row Level Security (optional, recommended for production)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;

-- Create policies (optional, for public access in development)
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON services FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON services FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON transactions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON transactions FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON expenses FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON expenses FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON barbers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON barbers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON barbers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON barbers FOR DELETE USING (true);
