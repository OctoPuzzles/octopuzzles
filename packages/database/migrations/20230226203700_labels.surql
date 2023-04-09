DEFINE TABLE label SCHEMAFULL 
  PERMISSIONS 
    FOR select FULL
    FOR delete, update, create NONE;

DEFINE FIELD name ON TABLE label TYPE string ASSERT $value != NONE;
DEFINE FIELD description ON TABLE label TYPE string ASSERT $value != NONE;