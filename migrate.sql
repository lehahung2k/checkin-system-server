create schema if not exists checkin;

create table if not exists Accounts (
    userId bigint auto_increment primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    fullName varchar(255) not null,
    phoneNumber varchar(20) not null,
    email varchar(255) not null,
    active int not null,
    role varchar(50) not null,
    tenantCode varchar(255) not null,
    companyName varchar(255) not null,
    enabled tinyint default 1 not null,
    confirmMailToken varchar(255) null,
    constraint IDX_b8c739ebd3c66e80ba528d46a2 unique (username)
);

create table if not exists Guests (
    guestId bigint auto_increment primary key,
    guestCode varchar(255) not null,
    guestDescription text not null,
    frontImg longblob null,
    backImg longblob null,
    identityType varchar(255) not null,
    enabled tinyint default 1 not null
);

create table if not exists Tenants (
    tenantId bigint auto_increment primary key,
    tenantCode varchar(255) not null,
    tenantName varchar(255) not null,
    tenantAddress varchar(255) not null,
    website varchar(255) not null,
    contactName varchar(255) not null,
    contactPhone varchar(20) not null,
    contactEmail varchar(255) not null,
    enabled tinyint default 1 not null,
    constraint IDX_648c1d643295047bb938922944 unique (tenantCode)
);

create table if not exists AccountsToTenants (
    userId bigint not null,
    tenantId bigint not null,
    primary key (userId, tenantId),
    constraint FK_13b7b95451a9ff341851d54f985 foreign key (userId) references Accounts (userId) on update cascade on delete cascade,
    constraint FK_eba3db43bba13d1ce32cdbb4976 foreign key (tenantId) references Tenants (tenantId) on update cascade on delete cascade
);

create index IDX_13b7b95451a9ff341851d54f98 on AccountsToTenants (userId);

create index IDX_eba3db43bba13d1ce32cdbb497 on AccountsToTenants (tenantId);

create table if not exists EventsMng (
    eventId bigint auto_increment primary key,
    eventCode varchar(255) not null,
    eventName varchar(255) not null,
    eventDescription text not null,
    startTime datetime not null,
    endTime datetime not null,
    eventImg longblob null,
    enabled tinyint default 1 not null,
    tenantCode varchar(255) not null,
    constraint IDX_1d1bc6dc800eb5d047c70b9136 unique (eventCode),
    constraint FK_ad1475e7371d466161e988e6dde foreign key (tenantCode) references Tenants (tenantCode)
);

create table if not exists PointsOfCheckin (
    pointId bigint auto_increment primary key,
    pointCode varchar(255) not null,
    pointName varchar(255) not null,
    pointNote varchar(255) null,
    enabled tinyint default 1 not null,
    eventCode varchar(255) not null,
    username varchar(255) not null,
    constraint IDX_2be5c066db620f966ff986c006 unique (pointCode),
    constraint FK_d417940d195bb3a69deb926fb8f foreign key (eventCode) references EventsMng (eventCode),
    constraint FK_e5e0fb6b2f97745aef8cf8a4510 foreign key (username) references Accounts (username)
);

create table if not exists Devices (
    deviceId bigint auto_increment primary key,
    deviceName varchar(255) not null,
    description text not null,
    enabled tinyint default 1 not null,
    pointCode varchar(255) not null,
    constraint FK_76574fce58a8798f0b8240b8ac6 foreign key (pointCode) references PointsOfCheckin (pointCode)
);

create table if not exists Transactions (
    userId bigint auto_increment primary key,
    guestCode varchar(255) not null,
    note varchar(255) not null,
    createdAt datetime not null,
    enabled tinyint default 1 not null,
    checkinImg1 longblob null,
    checkinImg2 longblob null,
    pointCode varchar(255) not null,
    constraint FK_81cbaf70eaf1690e869b1b120db foreign key (pointCode) references PointsOfCheckin (pointCode)
);

INSERT INTO checkin.Accounts (userId, username, password, fullName, phoneNumber, email, active, role, tenantCode, companyName, enabled, confirmMailToken) VALUES (2, 'admin', '$2b$06$Imf5zGJidnSTZD7qw2HV2e8nI1O84n0.DdU5F4T3EDfDJq/SxreuO', 'Le Ha Hung', '0123456789', 'hung@email.com', 1, 'admin', '', 'HUST', 1, null);
