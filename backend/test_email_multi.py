import sys
import os

# Add the current directory to sys.path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.email_service import send_email_alert, build_email_content

def test_multi_email():
    print("Testing Multi-Email Notification...")
    
    # Mock simulation result for testing
    mock_simulation = {
        "disaster_type": "TEST ALERT",
        "location": "DEBUG ZONE",
        "action_plan": "This is a test of the CrisisMind multi-email system. If you see this, the system is working correctly."
    }
    
    subject, body = build_email_content(mock_simulation, "System Debugger")
    
    print(f"Subject: {subject}")
    print("Sending...")
    
    result = send_email_alert(subject, body)
    
    if result.get("status") == "sent":
        print(f"SUCCESS: Email sent to {result.get('recipient')}")
    else:
        print(f"FAILED: {result.get('error')}")

if __name__ == "__main__":
    test_multi_email()
