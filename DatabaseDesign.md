## Thiết kế cơ sở dữ liệu

- Cơ sở dữ liệu gồm 7 bảng theo thiết kế sau:

```mermaid
erDiagram
    Tenants ||--|{ EventsMng : use
    EventsMng ||--|{ PointsOfCheckin : use
    Accounts ||--|{ PointsOfCheckin : use
    PointsOfCheckin ||--|{ Transaction : use
    PointsOfCheckin ||--|{ Devices : use
    Guests
    Accounts ||--o{ AccountsToTenants : contain
    Tenants ||--o{ AccountsToTenants : contain

    Accounts {
        long userId PK
        string username PK
        string password
        string fullName
        string phoneNumber
        string email
        int active
        string role
        string tenantCode
        string companyName
        bool enable
    }

    Tenants {
        long tenantId PK
        string tenantCode PK
        string tenantName
        string tenantAddress
        string website
        string contactName
        string contactPhone
        string contactEmail
        bool enable
    }

    AccountsToTenants {
        long userId FK
        long tenantId FK
    }

    EventsMng {
        long eventId PK
        string eventCode PK
        string eventName
        string tenantCode FK
        string eventDescription
        datetime startTime
        datetime endTime
        blob eventImg
        bool enable
    }

    PointsOfCheckin {
        long pointId PK
        string pointCode PK
        string pointName
        string pointNote
        string eventCode FK
        string username FK
        bool enable
    }

    Guests {
        long guestId PK
        string guestCode
        string guestDescription
        blob frontImg
        blob backImg
        string identityType
        bool enable
    }

    Transaction {
        long tranId PK
        string pointCode FK
        string guestCode
        string note
        datetime createdAt
        bool enable
        blob checkinImg1
        blob checkinImg2
    }

    Devices {
        long deviceId PK
        string deviceName
        string pointCode FK
        string description
        bool enable
    }
```
