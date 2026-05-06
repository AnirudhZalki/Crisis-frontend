import smtplib
import os
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load .env manually with absolute path if possible
try:
    from dotenv import load_dotenv
    # Try to find .env in the backend directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_path = os.path.join(base_dir, '.env')
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)
    else:
        load_dotenv() # Fallback to default
except ImportError:
    pass

def send_email_alert(subject: str, message: str, recipient: str = None, html_content: str = None) -> dict:
    """Send an email alert using Gmail SMTP with optional HTML support."""
    sender = os.environ.get("EMAIL_SENDER")
    password = os.environ.get("EMAIL_PASSWORD")
    default_recipient = os.environ.get("RECIPIENT_EMAIL")
    
    target_recipient = recipient or default_recipient
    
    if not sender or not password:
        error_msg = f"Email credentials missing."
        return {"status": "error", "error": error_msg}

    if not target_recipient:
        return {"status": "error", "error": "Recipient email missing."}

    try:
        recipients = [r.strip() for r in target_recipient.split(",") if r.strip()]
        
        msg = MIMEMultipart('alternative')
        msg['From'] = sender
        msg['To'] = ", ".join(recipients)
        msg['Subject'] = subject
        
        # Attach plain text version
        msg.attach(MIMEText(message, 'plain'))
        
        # Attach HTML version if provided
        if html_content:
            msg.attach(MIMEText(html_content, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender, password)
        text = msg.as_string()
        server.sendmail(sender, recipients, text)
        server.quit()
        
        return {
            "status": "sent",
            "recipient": ", ".join(recipients),
            "sent_at": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"DEBUG: SMTP Error: {e}")
        return {
            "status": "error",
            "error": str(e),
            "sent_at": datetime.datetime.utcnow().isoformat()
        }

def build_email_content(simulation: dict, approved_by: str | None = None) -> tuple[str, str, str]:
    disaster_type = simulation.get("disaster_type", "Emergency")
    location = simulation.get("location", "the affected area")
    
    subject = f"CrisisMind AI Alert: {disaster_type} in {location} - ACTION REQUIRED"
    
    # Plain text version (fallback)
    plain_text = f"""
🚨 CRISISMIND-AI HAS SENT AN EMERGENCY ALERT 🚨
Disaster: {disaster_type}
Location: {location}
Status: APPROVED & DISPATCHED
Approved By: {approved_by or "Crisis Command Center"}

ACTION PLAN:
{simulation.get('action_plan', 'Follow standard emergency protocols.')}
    """
    
    # Department alerts formatting for HTML
    dept_html = "".join([
        f"<div style='margin-bottom:10px; padding:10px; background:#f8fafc; border-left:4px solid #2563eb;'>"
        f"<strong style='color:#1e40af;'>{dept}:</strong> "
        f"<span style='color:#334155;'>{msg}</span>"
        f"</div>"
        for dept, msg in (simulation.get('department_alerts') or {}).items()
    ])

    # HTML Version with UI and Colors
    html_body = f"""
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            <!-- Header -->
            <div style="background-color: #1e40af; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CRISISMIND AI</h1>
                <p style="color: #bfdbfe; margin: 10px 0 0 0; font-weight: 600;">EMERGENCY COMMAND CENTER</p>
            </div>
            
            <!-- Alert Banner -->
            <div style="background-color: #fef2f2; border-bottom: 1px solid #fee2e2; padding: 20px; text-align: center;">
                <span style="background-color: #ef4444; color: #ffffff; padding: 5px 15px; border-radius: 20px; font-weight: 800; font-size: 14px;">🚨 URGENT ALERT</span>
                <h2 style="color: #991b1b; margin: 15px 0 0 0; font-size: 20px;">{disaster_type} in {location}</h2>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px;">
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">DISASTER STATUS</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">STATUS:</td>
                            <td style="padding: 8px 0; color: #10b981; font-weight: 800;">APPROVED & DISPATCHED</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">APPROVED BY:</td>
                            <td style="padding: 8px 0; color: #1e293b; font-weight: 700;">{approved_by or "Crisis Admin"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">TIMESTAMP:</td>
                            <td style="padding: 8px 0; color: #1e293b; font-weight: 700;">{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom: 25px; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e40af; margin-top: 0;">RECOMMENDED ACTION PLAN</h3>
                    <p style="color: #334155; line-height: 1.6; margin-bottom: 0;">{simulation.get('action_plan', 'Follow standard emergency protocols.')}</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">DEPARTMENT ALERTS</h3>
                    {dept_html}
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <a href="http://crisismind-ai.com" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">View Live Command Center</a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">This is an automated emergency notification from the CrisisMind AI Platform.</p>
                <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">&copy; 2025 CrisisMind AI Command Center</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return subject, plain_text, html_body
