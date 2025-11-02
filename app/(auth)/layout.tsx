import Image from "next/image"

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <main className="flex min-h-screen w-full justify-between font-inter">
          {children}
          <div className="auth-asset">
            <div style={{ 
              borderTop: '4px solid #9CA3AF',
              borderBottom: '4px solid #9CA3AF',
              borderLeft: '4px solid #9CA3AF',
              borderRight: 'none',
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              display: 'inline-block'
            }}>
              <Image 
                src="/images/dashboard-preview.png"
                width={650}
                height={750}
                alt="MG-Bank Dashboard Preview"
                style={{ 
                  objectFit: 'contain', 
                  display: 'block',
                  borderTopLeftRadius: '5px',
                  borderBottomLeftRadius: '5px',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px'
                }}
                priority
              />
            </div>
          </div>
      </main>
    );
  }
  