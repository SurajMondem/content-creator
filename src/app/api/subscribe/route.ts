import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send notification to admin
    const { error: adminEmailError } = await resend.emails.send({
      from: 'Persona AI <onboarding@resend.dev>',
      to: ['surajmondem@gmail.com'], // Replace with your email to receive notifications
      subject: 'New Waitlist Signup!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Waitlist Signup</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              background-color: #FF5400;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px 20px;
              background-color: white;
              border-left: 1px solid #eaeaea;
              border-right: 1px solid #eaeaea;
            }
            .card {
              border: 1px solid #eaeaea;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
              background-color: #f9f9f9;
            }
            .email-label {
              display: block;
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .email-value {
              font-size: 18px;
              font-weight: 500;
              color: #FF5400;
            }
            .timestamp {
              margin-top: 25px;
              font-size: 14px;
              color: #999;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-radius: 0 0 8px 8px;
              border: 1px solid #eaeaea;
              border-top: none;
            }
            .button {
              display: inline-block;
              background-color: #FF5400;
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 4px;
              margin-top: 15px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Persona AI - New Waitlist Signup</h1>
            </div>
            <div class="content">
              <p>Great news! A new user has joined your Persona AI waitlist.</p>
              
              <div class="card">
                <span class="email-label">Email Address:</span>
                <div class="email-value">${email}</div>
                <div class="timestamp">Signed up on ${new Date().toLocaleString(
                  'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}</div>
              </div>
              
              <p>You now have one more person excited to try your platform!</p>
              
              <p>To manage your waitlist subscribers, visit your admin dashboard:</p>
              <a href="https://personaai.com/admin" class="button">View Dashboard</a>
            </div>
            <div class="footer">
              <p>&copy; 2024 Persona AI. All rights reserved.</p>
              <p>This is an automated notification.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // // Send confirmation email to the user
    // const { error: userEmailError } = await resend.emails.send({
    //   from: 'Persona AI <onboarding@resend.dev>',
    //   to: [email],
    //   subject: 'Welcome to the Persona AI Waitlist!',
    //   html: `
    //     <!DOCTYPE html>
    //     <html>
    //     <head>
    //       <meta charset="utf-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Welcome to Persona AI</title>
    //       <style>
    //         body {
    //           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    //           line-height: 1.6;
    //           color: #333;
    //           background-color: #f9f9f9;
    //           margin: 0;
    //           padding: 0;
    //         }
    //         .container {
    //           max-width: 600px;
    //           margin: 0 auto;
    //           padding: 20px;
    //           background-color: #ffffff;
    //         }
    //         .header {
    //           text-align: center;
    //           padding: 30px 20px;
    //         }
    //         .logo {
    //           font-size: 32px;
    //           font-weight: bold;
    //           color: #FF5400;
    //           margin-bottom: 20px;
    //         }
    //         .hero {
    //           background-color: #FF5400;
    //           padding: 40px;
    //           text-align: center;
    //           color: white;
    //           border-radius: 8px;
    //           margin-bottom: 30px;
    //         }
    //         .hero h1 {
    //           margin: 0 0 20px 0;
    //           font-size: 28px;
    //         }
    //         .hero p {
    //           font-size: 18px;
    //           margin: 0;
    //           opacity: 0.9;
    //         }
    //         .content {
    //           padding: 0 20px 30px 20px;
    //           background-color: white;
    //         }
    //         .feature {
    //           display: flex;
    //           margin: 30px 0;
    //           align-items: center;
    //         }
    //         .feature-icon {
    //           width: 60px;
    //           height: 60px;
    //           background-color: rgba(255, 84, 0, 0.1);
    //           border-radius: 50%;
    //           display: flex;
    //           align-items: center;
    //           justify-content: center;
    //           margin-right: 20px;
    //           flex-shrink: 0;
    //         }
    //         .feature-icon span {
    //           color: #FF5400;
    //           font-size: 26px;
    //           font-weight: bold;
    //         }
    //         .feature-text h3 {
    //           margin: 0 0 5px 0;
    //           color: #333;
    //         }
    //         .feature-text p {
    //           margin: 0;
    //           color: #666;
    //           font-size: 16px;
    //         }
    //         .cta {
    //           text-align: center;
    //           margin: 40px 0 20px 0;
    //         }
    //         .cta-button {
    //           display: inline-block;
    //           background-color: #FF5400;
    //           color: white;
    //           text-decoration: none;
    //           padding: 15px 30px;
    //           border-radius: 6px;
    //           font-size: 18px;
    //           font-weight: 500;
    //         }
    //         .social {
    //           margin-top: 50px;
    //           text-align: center;
    //         }
    //         .social-link {
    //           display: inline-block;
    //           margin: 0 10px;
    //           color: #555;
    //           text-decoration: none;
    //           font-weight: 500;
    //         }
    //         .footer {
    //           background-color: #f5f5f5;
    //           padding: 20px;
    //           text-align: center;
    //           font-size: 14px;
    //           color: #666;
    //           border-radius: 0 0 8px 8px;
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="container">
    //         <div class="header">
    //           <div class="logo">Persona AI</div>
    //         </div>

    //         <div class="hero">
    //           <h1>You're on the Waitlist!</h1>
    //           <p>Thank you for joining the Persona AI waitlist. We're thrilled to have you!</p>
    //         </div>

    //         <div class="content">
    //           <p>Hello,</p>
    //           <p>We're excited that you've signed up for early access to Persona AI. We're working hard to create a platform that will transform how you create and share content across social media.</p>

    //           <div class="feature">
    //             <div class="feature-icon"><span>1</span></div>
    //             <div class="feature-text">
    //               <h3>Capture Raw Ideas</h3>
    //               <p>Quickly dump your content ideas and images in our simple, intuitive interface.</p>
    //             </div>
    //           </div>

    //           <div class="feature">
    //             <div class="feature-icon"><span>2</span></div>
    //             <div class="feature-text">
    //               <h3>AI-Powered Formatting</h3>
    //               <p>Our AI formats your content perfectly for each platform using customizable templates.</p>
    //             </div>
    //           </div>

    //           <div class="feature">
    //             <div class="feature-icon"><span>3</span></div>
    //             <div class="feature-text">
    //               <h3>One-Click Publishing</h3>
    //               <p>Preview, edit, and publish to multiple platforms simultaneously with a single click.</p>
    //             </div>
    //           </div>

    //           <p>We'll notify you as soon as we're ready to welcome our first users. As an early waitlist member, you'll get:</p>
    //           <ul>
    //             <li>Early access before the general public</li>
    //             <li>Special founding member benefits</li>
    //             <li>Priority support during onboarding</li>
    //           </ul>

    //           <div class="cta">
    //             <a href="https://personaai.com" class="cta-button">Learn More About Persona AI</a>
    //           </div>

    //           <p>In the meantime, if you have any questions or suggestions, feel free to reach out to us at <a href="mailto:hello@personaai.com">hello@personaai.com</a>.</p>

    //           <div class="social">
    //             <a href="#" class="social-link">Twitter</a> •
    //             <a href="#" class="social-link">LinkedIn</a> •
    //             <a href="#" class="social-link">Instagram</a>
    //           </div>
    //         </div>

    //         <div class="footer">
    //           <p>&copy; 2024 Persona AI. All rights reserved.</p>
    //           <p>You're receiving this email because you signed up for the Persona AI waitlist.</p>
    //         </div>
    //       </div>
    //     </body>
    //     </html>
    //   `,
    // });

    if (adminEmailError) {
      return NextResponse.json(
        { error: adminEmailError?.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
