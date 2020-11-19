document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_mail;

  // By default, load the inbox
  load_mailbox('inbox');
});


// function determines show/hide of element# ending with "-view"
function view_display(view) {
  document.querySelectorAll('[id$="-view"]').forEach((item => {
    item.style.display = (item.id.match(view))? 'block' : 'none'
  }));
}

/**
 * Gets all emails for mailbox requested and
 * display them in #emails-view div.
 */
function load_mailbox(mailbox) {

  const defalt_list_style = 
  "list-group-item list-group-item-action flex-column align-items-start";

  // Show the mailbox and hide other views
  view_display('emails');

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = 
  `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // If no emails in requested email box.
    if (emails.length == 0) {
      const no_emails_msg = document.createElement('div');
      no_emails_msg.className = "alert alert-danger";
      no_emails_msg.role = "alert";
      no_emails_msg.innerHTML = `No emails in ${mailbox}`;
      document.querySelector('#emails-view').append(no_emails_msg);
    } 
    
    //Create a new anchor element for each email.
    else {
      emails.forEach(element => {
        const email_box = document.createElement('a');
        //return different "read" badge depend on read status. 
        let is_read = (element.read === true)? 
        '<span class="badge badge-success badge-pill">read</span>' 
        : 
        '<span class="badge badge-danger badge-pill">unread</span>';
        //no read element if email in sent box
        let show_read = (mailbox=='sent')? '' : `${is_read}`;
        
        //un-read|sent|archived emails have different background color.
        email_box.className = (mailbox=='inbox')? 
        ((element.read === true)? `${defalt_list_style} + list-group-item-light`: `${defalt_list_style} + list-group-item-secondary`) : 
        ((mailbox === 'sent')? `${defalt_list_style} + list-group-item-info` : `${defalt_list_style} + list-group-item-warning`);
            
        email_box.href ='#';//give the email_box active link style.
        // sent mails doesnt show sender, inbox emails doesnt show recipient.
        let content = (mailbox=='sent')?  '' : `<strong>From:</strong> ${element.sender}<br>`;
        content += (mailbox=='sent')? `<strong>To:</strong> ${element.recipients}<br>` : '';
        content += `<strong>Subject: </strong>`  + (element.subject? `${element.subject}<br>` : 'No Subject<br>')
        + `<span class="badge badge-info badge-pill"><strong>On</strong> ${element.timestamp}</span> 
           <span style="float:right">${show_read}</span><br>`;
        email_box.innerHTML = content;

        document.querySelector('#emails-view').append(email_box);
        
        email_box.addEventListener('click', () => {
          display_email(element, mailbox)
        });
      });
    }
  });
}

function compose_email() {
  //show compose form div and hide other #$-view divs.
  view_display('compose');
  
  // Clear out composition fields (input elements with id starting with "compose" )
  document.querySelectorAll('input[id^="compose"]').forEach((item) => {
    item.value = '';
  });
 }

/**
 * Validate the compose email form for recipients field
 * Call mail API to POST data.
 * Load sent box if successful.
 */
function send_mail() {
  let form = document.querySelector('#compose-form');
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
    return;
  }    
    
  fetch('/emails',{
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value

    })
  })
      .then(response => response.json())
      .then(result => {
        if (result.status == 201) {
          alert(`${result["message"]}`);
          load_mailbox('sent');
        } else {
          //API will validate recipients are registered and return error if not.
          document.querySelector('#recipients-alert').textContent = result.error;
          document.querySelector('#compose-recipients').className = 'form-control is-invalid';
        }
      });
  //stop form from submitting.
  return false;
}

/**
 * Display an email contents in #read-view div
 * Return "reply and "(un)archive" botton if not a sent email.
 */
function display_email(email, mailbox) {
  view_display('read');

  const content = document.querySelector('#read-view');
  let subject = (email.subject)? email.subject : 'No Subject';
  let body = email.body? email.body : 'No Content';
  
  content.innerHTML = `
    <div class="email_display">
    <strong>From:</strong> ${email.sender}<br>
    <strong>To:</strong> ${email.recipients}<br>
    <strong>Subject:</strong> ${subject}<br>
    <strong>On:</strong> <span class="badge badge-info badge-pill">${email.timestamp}</span><br><hr>
    <span style="white-space: pre-wrap;">${body}</span><hr>
    </div>`
  
  if (mailbox === 'sent') return;

  else {
    content.innerHTML += `<button class="btn btn-success mr-2" onclick="reply_email(${email.id})">
    Reply</button> `;
    content.appendChild(toggle_archive(email.id, email.archived));
  };
  //Mark email as read if required.
  if (email.read === false) {
    fetch(`/emails/${email.id}`, {
      method:'PUT',
      body:JSON.stringify({
      read: true
      })
    })
  }
}

/**
 * Create a archive button and a PUT request
 * to update email archive status.
 */
function toggle_archive (email_id, archived) {
  let content = (archived)? 'Un-archive' : 'Archive';
  const button = document.createElement('button');
  button.innerHTML = `${content}`;
  button.className = 'btn btn-secondary';
  button.addEventListener("click", () => {
    fetch(`/emails/${email_id}`, {
      method:'PUT',
      body:JSON.stringify({
      archived: !archived
      })
    });
    setTimeout(load_mailbox, 100, "inbox");
  });
  
  return button;    
}

/**
 * Retrieves an email, pre-populate email content into the compose email form.
 */
function reply_email(id) {
  
  view_display('compose');
  document.querySelector('[id^="compose"]>h3').innerHTML = "Reply Email";

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    document.querySelector('#compose-body').value = '\n----------------------' + 
    `\nOn: ${email.timestamp} ${email.sender} wrote:` + 
    `\n${email.body}`;
  });
}


