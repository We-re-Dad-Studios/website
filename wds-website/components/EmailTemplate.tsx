import React from 'react';

interface WelcomeEmailProps {
  subscriberName?: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ subscriberName = 'there' }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Welcome to Our Newsletter</title>
      </head>
      <body style={{
        margin: 0,
        padding: '20px',
        backgroundColor: '#000000',
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        color: '#FFFFFF'
      }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', margin: 'auto' }}>
          
          {/* Header */}
          <tr>
            <td align="center" style={{ padding: '20px 0' }}>
              <img 
                src="https://weredadstudios.com/images/WDS%20LOGO%20WHITE.png" 
                alt="WDS Logo" 
                style={{ maxWidth: '200px', height: 'auto' }}
              />
            </td>
          </tr>

          {/* Welcome Card */}
          <tr>
            <td style={{
              backgroundColor: '#121212',
              border: '1px solid #4F1787',
              padding: '20px',
              borderRadius: '10px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#4F1787' }}>WELCOME</p>
              <h2 style={{ margin: '10px 0', fontSize: '22px', color: '#FFFFFF' }}>
                Thanks for joining us, {subscriberName}!
              </h2>
              <p style={{ fontSize: '16px', color: '#E5E5E5', lineHeight: '1.6' }}>
                You&apos;re now part of our exclusive community. Get ready for chapter updates, 
                behind-the-scenes content, and special announcements delivered straight to your inbox.
              </p>
              <a 
                href="https://weredadstudios.com" 
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  backgroundColor: '#4F1787',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                Visit Our Website
              </a>
            </td>
          </tr>

          {/* More Content */}
          {/* <tr>
            <td style={{ padding: '30px 20px' }}>
              <h3 style={{ color: '#4F1787', margin: '0 0 10px' }}>Want More?</h3>
              <p style={{ color: '#CCCCCC', fontSize: '15px', margin: '0 0 15px' }}>
                Become a patron to get early access to chapters, exclusive artwork, and behind-the-scenes content!
              </p>
              <a 
                href="https://patreon.com/yournovel"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#000000',
                  color: '#4F1787',
                  border: '1px solid #4F1787',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Support on Patreon
              </a>
            </td>
          </tr> */}

          {/* Footer */}
          <tr>
            <td align="center" style={{ padding: '20px', fontSize: '13px', color: '#888888' }}>
              &copy; {new Date().getFullYear()} We're Dad Studios. All rights reserved.<br />
               <a 
                href="https://weredadstudios.com" 
                style={{ color: '#4F1787', textDecoration: 'none' }}
              >
                Unsubscribe
              </a>{/* | 
              <a 
                href="https://yourwebsite.com/preferences" 
                style={{ color: '#4F1787', textDecoration: 'none' }}
              >
                Manage Preferences
              </a> */}
              <p style={{ fontSize: '11px', marginTop: '10px' }}>Sent with ♥ from the WDS Team</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

export default WelcomeEmail;