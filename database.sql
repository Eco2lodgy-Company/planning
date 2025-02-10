-- Création de la table "users"
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    matricule VARCHAR(30) not NULL,
    nom_complet VARCHAR(255) NOT NULL,
    nationality VARCHAR(30),
    genre char(1) not NULL,
    tel VARCHAR(100) not null UNIQUE,
    mail VARCHAR(255) UNIQUE NOT NULL,
    adresse VARCHAR(50) not null,
    departement VARCHAR(30) NOT NULL,
    poste VARCHAR(50) not null,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE typeProjet(
id_type SERIAL PRIMARY KEY,
type VARCHAR(50) not null,
created_at TIMESTAMP DEFAULT NOW()
);
-- Création de la table "projets"
CREATE TABLE projets (
    id_projet SERIAL PRIMARY KEY,
    project_name VARCHAR(255) UNIQUE NOT NULL,
    project_type INT REFERENCES typeProjet(id_type) ON DELETE SET NULL,
    partenaire VARCHAR(255),
    echeance INTEGER not null,
    chef_projet INT REFERENCES users(id_user) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Création de la table "taches"
CREATE TABLE taches (
    id_tache SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    niveau INT NOT NULL,
    id_user INT REFERENCES users(id_user) ON DELETE CASCADE,
    id_projet INT REFERENCES projets(id_projet) ON DELETE CASCADE,
    departement VARCHAR(100),--###
    echeance INT not null,
    dateDebut DATE not null,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Création de la table "permissions"
CREATE TABLE permissions (
    id_p SERIAL PRIMARY KEY,
    id_user INT REFERENCES users(id_user) ON DELETE CASCADE,
    dateDebut DATE,
    dateFin DATE,
    motif VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Création de la table "absences"
CREATE TABLE absences (
    id_absence SERIAL PRIMARY KEY,
    id_user INT REFERENCES users(id_user) ON DELETE CASCADE,
    date_absence DATE NOT NULL,
    motif TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Création de la table "retard"
CREATE TABLE retard (
    id_retard SERIAL PRIMARY KEY,
    id_user INT REFERENCES users(id_user) ON DELETE CASCADE,
    date_retard DATE NOT NULL,
    motif TEXT NOT NULL,
    temps INT CHECK (temps > 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Création de la table "mycart"
-- CREATE TABLE rapport (
--     id SERIAL PRIMARY KEY,
--     id_user INT REFERENCES users(id_user) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );
