DEFINE TABLE environment SCHEMAFULL PERMISSIONS
        FOR select, update WHERE $scope = 'admin'
        FOR create, delete NONE;

DEFINE FIELD value ON TABLE environment TYPE string ASSERT $value != NONE;

IF environment:sendinblueApikey.id = NONE THEN
        (CREATE environment:sendinblueApikey SET value = "BLANK")
END;