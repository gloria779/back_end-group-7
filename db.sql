CREATE DATABASE  ucu_accommodation;
USE ucu_accommodation;

CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  access_number VARCHAR(32) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'landlord', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  location VARCHAR(255),
  features JSON,
  images JSON,
  description TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  landlord_id INT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  hostel VARCHAR(50) NOT NULL CHECK (hostel IN ('Sky Courts', 'Pemium', 'Jones', 'David''s Ark', 'Vienna', 'Tupendane', 'Soso')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  CONSTRAINT unique_favorite UNIQUE (user_id, listing_id)
);

CREATE TABLE reviews (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE reports (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  issue_type VARCHAR(100) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_listing_hostel ON listings(hostel);
CREATE INDEX idx_listing_approved ON listings(approved);
CREATE INDEX idx_favorite_user ON favorites(user_id);
CREATE INDEX idx_review_listing ON reviews(listing_id);
CREATE INDEX idx_report_listing ON reports(listing_id);