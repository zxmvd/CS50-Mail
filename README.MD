# Specification
This is a <strong>single-page email app</strong> makes API calls to send and receive emails, implementing by vanilla JavaScript, HTML, and Django backend. <br>
<a href="https://cs50-mail.herokuapp.com/">Live Demo</a> with<br>
Email: <a>user<span>@</spn>example.com</a><br>
PSW: 123<br>

# Features

<h3>Mailbox:<h3>
When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.


<img src="staticfiles/inbox.png" width=600/>
<img src="staticfiles/sent.png" width=400/>
<img src="staticfiles/arch.png" width=400/>
<hr> 
<h3>Send Mail:</h3>
When a user submits the email composition form, the JavaScript code actually send the email to recipients registered in the database.

<img src="staticfiles/compose.png" width=600/>
<hr>
<h3>View Email:</h3>
Request the email and render a view displaying its content. Once clicked on, the email should be marked as read. Allow users to archive/unarchive received emails (but not applying to sent emails).

<img src="staticfiles/email.png" width=600/>
<hr> 
<h3>Reply:</h3>
When the user clicks the “Reply” button, a pre-filled email composition form will be returned. 
