<?php
// contact-handler-fixed.php
// Replace with your email address
$to = "alfredgodwin937@gmail.com";
$subject = "New Contact Form Submission";

// Collect POST data
$name = $_POST['your-name'] ?? '';
$phone = $_POST['your-phone'] ?? '';
$email = $_POST['your-email'] ?? '';
$user_subject = $_POST['your-subject'] ?? '';
$message = $_POST['your-message'] ?? '';

// Build the email content
$body = "Name: $name\n";
$body .= "Phone: $phone\n";
$body .= "Email: $email\n";
$body .= "Subject: $user_subject\n";
$body .= "Message:\n$message\n";

$headers = "From: $email\r\nReply-To: $email\r\n";

// Send the email
if(mail($to, $subject, $body, $headers)) {
    echo "<div style='color:green;'>Thank you! Your message has been sent successfully.</div>";
} else {
    echo "<div style='color:red;'>Sorry, there was an error sending your message. Please try again later.</div>";
}
?>
