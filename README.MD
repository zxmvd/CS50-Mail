# Specification
<hr>
This is a <str>single-page email app</str> makes API calls to send and receive emails, implementing by vanilla JavaScript, HTML, and Django backend. <br>
<a href="https://cs50-mail.herokuapp.com/">Live Demo</a><br>
Email: <a>user@example.com</a> <br>
PSW: 123<br>

# Features 
## Mailbox:
When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox. 
<img src="staticfiles/inbox.png" width:300>
<img src="staticfiles/sent.png" width:300>
<img src="staticfiles/arch.png" width:300>

## Send Mail:
When a user submits the email composition form, the JavaScript code actually send the email to recipients registered in the database.
<img src="staticfiles/compose.png" width:300>
## View Email:
Request the email and render a view displaying its content. Once clicked on, the email should be marked as read. Allow users to archive/unarchive received emails (but not applying to sent emails).
<img src="staticfiles/email.png" width:300>
## Reply:
When the user clicks the “Reply” button, a pre-filled email composition form will be returned. 