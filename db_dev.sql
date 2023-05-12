CREATE TABLE IF NOT EXISTS Guests
(
    guestId          bigint       not null auto_increment,
    guestCode        varchar(255) not null unique,
    guestDescription varchar(255),
    frontImg         longblob,
    backImg          longblob,
    identityType     varchar(255) NOT NULL,
    enabled          tinyint(1),

    primary key (guestId)
);

CREATE TABLE IF NOT EXISTS Tenants
(
    tenantId      bigint       not null auto_increment,
    tenantCode    varchar(255) not null unique,
    tenantName    varchar(255) not null,
    tenantAddress varchar(255) not null,
    website       varchar(255),
    contactName   varchar(255),
    contactPhone  varchar(255),
    contactEmail  varchar(255),
    enabled       tinyint(1),

    primary key (tenantId)
);

CREATE TABLE IF NOT EXISTS Accounts
(
    userId      bigint       not null auto_increment,
    username    varchar(255) not null unique,
    password    varchar(255) not null,
    fullName    varchar(255),
    phoneNumber varchar(255),
    email       varchar(255),
    active      tinyint(1),
    role        varchar(45),
    tenantCode  varchar(255),
    companyName varchar(255),
    enabled     tinyint(1),

    primary key (userId),
);

CREATE TABLE IF NOT EXISTS AccountsToTernants
(
    userId     bigint       not null,
    tenantCode varchar(255) not null unique,

    primary key (userId, tenantCode),
    foreign key (userId) references Accounts (userId),
    foreign key (tenantCode) references Tenants (tenantCode)
);

CREATE TABLE IF NOT EXISTS EventsMng
(
    eventId          bigint       NOT NULL AUTO_INCREMENT,
    eventCode        varchar(255) NOT NULL UNIQUE,
    eventName        VARCHAR(255) NOT NULL,
    tenantCode       VARCHAR(255) NOT NULL,
    eventDescription TEXT,
    startTime        DATETIME     NOT NULL,
    endTime          DATETIME     NOT NULL,
    eventImg         LONGBLOB,
    enabled          tinyint(1),

    PRIMARY KEY (eventId),
    FOREIGN KEY (tenantCode) REFERENCES Tenants (tenantCode),
);

CREATE TABLE IF NOT EXISTS PointsOfCheckin
(
    pointId   int          not null AUTO_INCREMENT,
    pointCode varchar(255) not null unique,
    pointName varchar(255) not null,
    pointNote text,
    eventCode varchar(255) not null,
    username  varchar(255) not null,
    enabled   tinyint(1),

    primary key (pointId),
    foreign key (eventCode) references EventsMng (eventCode),
    foreign key (username) references Accounts (username),
);

CREATE TABLE IF NOT EXISTS Transactions
(
    tranId      bigint       NOT NULL AUTO_INCREMENT,
    pointCode   varchar(255) not null,
    guestCode   varchar(255) not null,
    createdAt   datetime,
    note        text,
    enabled     tinyint(1),
    checkinImg1 LONGBLOB,
    checkinImg2 LONGBLOB,

    PRIMARY KEY (tranId),
    FOREIGN KEY (pointCode) REFERENCES PointsOfCheckin (pointCode)
);

CREATE TABLE IF NOT EXISTS Devices
(
    deviceId    BIGINT       NOT NULL,
    deviceName  VARCHAR(255) NOT NULL,
    pointCode   VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    enabled     tinyint(1),

    PRIMARY KEY (deviceId),
    FOREIGN KEY (pointCode) REFERENCES PointsOfCheckin (pointCode)
);
