<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';

// Validate email
if (empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// Database configuration (update with your credentials)
$db_host = 'localhost';
$db_name = 'pnx_waitlist';
$db_user = 'root';
$db_pass = '';

try {
    // Connect to database
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS waitlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('pending', 'confirmed', 'notified') DEFAULT 'pending'
    )");
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM waitlist WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email already registered',
            'already_registered' => true
        ]);
        exit();
    }
    
    // Insert new email
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    $stmt = $pdo->prepare("INSERT INTO waitlist (email, ip_address, user_agent) VALUES (?, ?, ?)");
    $stmt->execute([$email, $ip_address, $user_agent]);
    
    // Optional: Send confirmation email
    // mail($email, 'Welcome to PNX Waitlist', 'Thank you for joining!');
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Successfully added to waitlist',
        'already_registered' => false
    ]);
    
} catch (PDOException $e) {
    // Log error (don't expose database details)
    error_log('Database error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode(['error' => 'Server error. Please try again later.']);
}

