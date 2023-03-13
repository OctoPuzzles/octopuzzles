DEFINE TABLE send_email SCHEMALESS
    PERMISSIONS NONE DROP;

DEFINE FIELD to_name ON TABLE send_email TYPE string ASSERT $value != NONE;
DEFINE FIELD to_email ON TABLE send_email TYPE string ASSERT is::email($value);
DEFINE FIELD subject ON TABLE send_email TYPE string ASSERT $value != NONE;
DEFINE FIELD content ON TABLE send_email TYPE array ASSERT $value != NONE;

DEFINE EVENT email ON TABLE send_email WHEN 1=1 THEN {
    LET $apikey = SELECT value FROM environment:sendinblue_apikey;

    http::post('https://api.sendinblue.com/v3/smtp/email', {
        sender: {
            name: 'Octo',
            email: 'octo@octopuzzles.com'
        },
        to: [{
            email: $after.to_email,
            name: $after.to_name
        }],
        subject: $after.subject,
        htmlContent: $after.content
    }, {
        "api-key": $apikey.value,
        "Content-Type": "application/json",
        "accept": "application/json"
    })
};