import imaplib
import email
import os

# Login credentials
username = "testtechnicc@gmail.com"
password = "kyffulugtmgkfgmr"

# Connect to the mail server
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(username, password)
# Select the mailbox you want to download attachments from
mail.select("inbox")

# Search for unread emails
typ, msgs = mail.search(None, '(UNSEEN)')
msgs = msgs[0].split()

# Loop through all the unread emails
for msg_id in msgs:
    # Fetch the email message by ID
    typ, data = mail.fetch(msg_id, "(RFC822)")
    raw_email = data[0][1]
    print('Hello')
    # Parse the email message using the email module
    email_message = email.message_from_bytes(raw_email)

    # Loop through all the attachments and download them
    for part in email_message.walk():
        if part.get_content_maintype() == 'multipart':
            continue
        if part.get('Content-Disposition') is None:
            continue

        # Save the attachment to disk
        filename = part.get_filename()
        if filename:
            filepath = os.path.join('C:/Users/Temara/OneDrive - Ecole des Sciences de l\'Information/Bureau/ocr_tEST/Documents', filename)
            with open(filepath, 'wb') as f:
                f.write(part.get_payload(decode=True))
                print("Attachment downloaded: ", filename)

# Logout from the mail server
mail.close()
mail.logout()



