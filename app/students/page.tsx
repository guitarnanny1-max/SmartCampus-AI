import { prisma } from '@/lib/prisma';

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    include: { school: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f8fafc' }}>
        👨‍🎓 Student Management
      </h1>
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.5rem', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #475569', color: '#94a3b8' }}>
              <th style={{ padding: '12px' }}>Student ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Grade</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>GPA</th>
              <th style={{ padding: '12px' }}>School</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #334155', color: '#e2e8f0' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{student.studentId}</td>
                <td style={{ padding: '12px', fontWeight: '600' }}>{student.name}</td>
                <td style={{ padding: '12px' }}>{student.grade}</td>
                <td style={{ padding: '12px', color: '#38bdf8' }}>{student.email}</td>
                <td style={{ padding: '12px' }}>{student.gpa ?? 'N/A'}</td>
                <td style={{ padding: '12px' }}>{student.school?.name}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.85rem', 
                    background: student.status === 'Active' ? '#065f46' : '#991b1b',
                    color: '#fff'
                  }}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No students found. Re-seed your database to view mock data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
