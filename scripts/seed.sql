-- SmartCampusAI Enterprise ERP - Initial Schema & Seed Data

-- Drop tables if they exist (for clean local re-runs)
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS library_books;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS staff;

-- 1. Students Table
CREATE TABLE students (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL,
    gpa NUMERIC(3, 2)
);

-- 2. Staff Table
CREATE TABLE staff (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- 3. Library Books Table
CREATE TABLE library_books (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    borrower VARCHAR(100) DEFAULT '-'
);

-- 4. Invoices Table
CREATE TABLE invoices (
    id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL
);

-- Seed Data: Students
INSERT INTO students (id, name, grade, email, status, gpa) VALUES
('STU-001', 'Aarav Sharma', 'Grade 10', 'aarav.sharma@smartcampus.ai', 'Active', 3.85),
('STU-002', 'Diya Patel', 'Grade 9', 'diya.patel@smartcampus.ai', 'Active', 3.62),
('STU-003', 'Kabir Verma', 'Grade 11', 'kabir.verma@smartcampus.ai', 'Active', 3.91),
('STU-004', 'Ananya Iyer', 'Grade 12', 'ananya.iyer@smartcampus.ai', 'Active', 3.78);

-- Seed Data: Staff
INSERT INTO staff (id, name, department, role, email, status) VALUES
('EMP-001', 'Dr. Ramesh Gupta', 'Mathematics', 'Senior Professor', 'ramesh.gupta@smartcampus.ai', 'Active'),
('EMP-002', 'Priya Deshmukh', 'Computer Science', 'Head of Department', 'priya.deshmukh@smartcampus.ai', 'Active'),
('EMP-003', 'Vikram Malhotra', 'Administration', 'Campus Operations Director', 'vikram.malhotra@smartcampus.ai', 'Active');

-- Seed Data: Library Books
INSERT INTO library_books (id, title, author, category, status, borrower) VALUES
('LIB-001', 'Introduction to Algorithms', 'Cormen et al.', 'Computer Science', 'Available', '-'),
('LIB-002', 'University Physics (14th Edition)', 'Young & Freedman', 'Science', 'Checked Out', 'Aarav Sharma (Grade 10)'),
('LIB-003', 'Organic Chemistry', 'Paula Yurkanis Bruice', 'Science', 'Overdue', 'Diya Patel (Grade 9)');

-- Seed Data: Invoices
INSERT INTO invoices (id, student_name, grade, amount, status, due_date) VALUES
('INV-001', 'Aarav Sharma', 'Grade 10', 1200.00, 'Paid', '2026-08-15'),
('INV-002', 'Diya Patel', 'Grade 9', 1200.00, 'Pending', '2026-08-30'),
('INV-003', 'Kabir Verma', 'Grade 11', 1450.00, 'Overdue', '2026-08-01');
