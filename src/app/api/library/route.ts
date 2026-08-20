export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const school = await getCurrentSchool();
    let books = await prisma.libraryBook.findMany({
      where: { schoolId: school.id },
      orderBy: { createdAt: 'desc' },
    });

    if (books.length === 0) {
      const defaultBooks = [
        { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isbn: '978-0136042594', status: 'CHECKED_OUT', borrower: 'Alex Mercer (CS-2026-089)' },
        { title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose & Keith Ross', isbn: '978-0133594140', status: 'AVAILABLE', borrower: null },
        { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', status: 'AVAILABLE', borrower: null },
      ];

      for (const b of defaultBooks) {
        await prisma.libraryBook.create({
          data: { schoolId: school.id, ...b },
        });
      }

      books = await prisma.libraryBook.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch library inventory' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const school = await getCurrentSchool();
    const { title, author, isbn } = await req.json();

    if (!title || !author || !isbn) {
      return NextResponse.json({ error: 'Title, author, and ISBN are required' }, { status: 400 });
    }

    const book = await prisma.libraryBook.create({
      data: {
        schoolId: school.id,
        title,
        author,
        isbn,
        status: 'AVAILABLE',
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add library book' }, { status: 500 });
  }
}
