FORMAT: 1A
HOST: https://cageur-api-staging.herokuapp.com/api/v1/

# Caguer API Docs v1.0

Caguer API v1.0 contains :
1. Clinic Module
2. Disease Group Module
3. Patient Module
4. Patient Disease Group Module


## API Clinic - Get All and Create [/clinic]

### Get All Clinic [GET]

+ Response 200 (application/json)

        [
            {"status":"success","data":[{"id":1,"name":"klinik satu","address":"jalan soekarno","phone_number":"111","created_at":"2017-01-15T03:54:12.661Z","updated_at":"2017-01-15T03:54:12.661Z"},{"id":2,"name":"klinik dua","address":"jalan soeharto","phone_number":"222","created_at":"2017-01-15T03:54:12.915Z","updated_at":"2017-01-15T03:54:12.915Z"},{"id":3,"name":"klinik tiga","address":"jalan megawati","phone_number":"333","created_at":"2017-01-15T03:54:13.166Z","updated_at":"2017-01-15T03:54:13.166Z"},{"id":4,"name":"klinik empat","address":"jalan gus doer","phone_number":"444","created_at":"2017-01-15T03:54:13.420Z","updated_at":"2017-01-15T03:54:13.420Z"}],"message":"Retrieved all clinic data"}
        ]

### Create a New Clinic [POST]

+ Request (application/json)

        {
            "clinic_name":"clinic test",
            "address":"bandung",
            "phone":"8",
            "fax":"8"
        }

+ Response 200 (application/json)

    + Headers

            Location: /api/v1/clinic
    + Body

            {
              "status": "success",
              "message": "clinic data succesfully added to db"
            }
            
            
                    
## API Clinic - Detail, Update, and Delete  [/clinic/:id]        
### Get One Clinic [GET]
+ Response 200 (application/json)

        [
           {
              "status": "success",
              "data": {
                "id": 143,
                "name": "clinic test",
                "address": "bandung",
                "phone": 8,
                "fax": 8,
                "created_at": "2017-01-12T11:44:32.985Z",
                "updated_at": "2017-01-12T11:44:32.985Z"
              },
              "message": "Retrieved one clinic"
            }
        ]
        
### Update Clinic [PUT]
+ Request (application/json)

        {
            "clinic_name":"clinic test",
            "address":"bandung",
            "phone":"8",
            "fax":"8"
        }
        
+ Response 200 (application/json)

        [
            {
              "status": "success",
              "message": "clinic data succesfully updated to db"
            }
        ]

### Delete Clinic [DELETE]
+ Response 200 (application/json)

        [
            {
              "status": "success",
              "message": "Removed 1 clinic"
            }
        ]


## API Disease Group - Get All and Create [/disease_group]

### Get All Disease Group [GET]

+ Response 200 (application/json)

        [
            {
            "status": "success",
            "data": [
                {
                "id": 12,
                "name": "hati lemah",
                "created_at": "2017-01-12T11:56:17.090Z",
                "updated_at": "2017-01-12T11:56:17.090Z"
                }
            ],
            "message": "Retrieved all disease_group data"
            }
        ]

### Create a New Disease Group [POST]

+ Request (application/json)

        {
            "disease_name":"test"
        }

+ Response 200 (application/json)

    + Headers

            Location: /api/v1/disease_group
    + Body

            {
            "status": "success",
            "message": "disease_group data succesfully added to db"
            }
            
            
                    
## API Disease Group - Detail, Update, and Delete  [/disease_group/:id]        
### Get One Disease Group [GET]
+ Response 200 (application/json)

        [
            {
            "status": "success",
            "data": {
                "id": 12,
                "name": "hati lemah",
                "created_at": "2017-01-12T11:56:17.090Z",
                "updated_at": "2017-01-12T11:56:17.090Z"
            },
            "message": "Retrieved one disease_group"
            }
        ]
        
### Update One Disease Group [PUT]
+ Request (application/json)

        {
            "disease_name":"test"
        }
        
+ Response 200 (application/json)

        [
            {
            "status": "success",
            "message": "disease_group data succesfully updated to db"
            }
        ]

### Delete Disease Group [DELETE]
+ Response 200 (application/json)

        [
            {
              "status": "success",
              "message": "Removed 1 disease_group"
            }
        ]


## API Patient Module - Get All and Create [/patient]

### Get All Patient [GET]

+ Response 200 (application/json)

        [
            {
            "status": "success",
            "data": [
                {
                "id": 28,
                "clinic_id": 144,
                "phone_number": "8888",
                "first_name": "anisa",                                                                                                                                                                                                                                                         
                "last_name": "bahar",                                                                                                                                                                                                                                                       
                "line_user_id": "anisabahar",                                                                                                                                                                                                                     
                "created_at": "2017-01-16T09:39:05.390Z",
                "updated_at": "2017-01-16T09:39:05.390Z"
                }
            ],
            "message": "Retrieved all patient data"
            }
        ]

### Create a New Patient [POST]

+ Request (application/json)

        {
            "id_category":"12",
            "id_clinic":"12",
            "phone_number":"12",
            "first_name":"guta",
            "last_name":"saputra",
            "lineid":"gutasaputra"
        }

+ Response 200 (application/json)

    + Headers

            Location: /api/v1/patient

    + Body
    
            {
                "status": "success",
                "message": "patient data succesfully added to db"
            }
            
            
                    
## API Patient - Detail, Update, and Delete  [/patient/:id]        
### Get One Patient [GET]
+ Response 200 (application/json)

        [
            {
            "status": "success",
            "data": {
                "id": 28,
                "clinic_id": 144,
                "phone_number": "8888",
                "first_name": "anisa",                                                                                                                                                                                                                                                         
                "last_name": "bahar",                                                                                                                                                                                                                                                         
                "line_user_id": "anisabahar",                                                                                                                                                                                                                                                    
                "created_at": "2017-01-16T09:39:05.390Z",
                "updated_at": "2017-01-16T09:39:05.390Z"
            },
            "message": "Retrieved one patient"
            }
        ]
        
### Update One Patient [PUT]
+ Request (application/json)

        {
            "id_category":"12",
            "id_clinic":"12",
            "phone_number":"12",
            "first_name":"guta",
            "last_name":"saputra",
            "lineid":"gutasaputra"
        }
        
+ Response 200 (application/json)

        [
            {
            "status": "success",
            "message": "patient data succesfully updated to db"
            }
        ]

### Delete Patient [DELETE]
+ Response 200 (application/json)

        [
            {
              "status": "success",
              "message": "Removed 1 patient"
            }
        ]


## API Patient Disease Group - Get All and Create [/patient_disease_group]

### Get All Patient Disease Group [GET]

+ Response 200 (application/json)

        [
            {
            "status": "success",
            "data": [
                {
                "id": 5,
                "patient_id": 28,
                "disease_group_id": 12,
                "created_at": "2017-01-16T09:47:20.911Z",
                "updated_at": "2017-01-16T09:47:20.911Z"
                }
            ],
            "message": "Retrieved all patient_disease_group data"
            },
                        {
            "status": "success",
            "data": [
                {
                "id": 6,
                "patient_id": 28,
                "disease_group_id": 12,
                "created_at": "2017-01-16T09:47:20.911Z",
                "updated_at": "2017-01-16T09:47:20.911Z"
                }
            ],
            "message": "Retrieved all patient_disease_group data"
            }
        ]

### Create a New Disease Group [POST]

+ Request (application/json)

        {
            "patient_id":"28",
            "disease_group_id":"12"
        }

+ Response 200 (application/json)

    + Headers

            Location: /api/v1/patient_disease_group
    + Body

            {
            "status": "success",
            "message": "patient_disease_group data succesfully added to db"
            }
            
            
                    
## API Patient Disease Group - Detail, Update, and Delete  [/patient_disease_group/:id]        
### Get One Patient Disease Group [GET]
+ Response 200 (application/json)

        [
            {
            "status": "success",
            "data": {
                "id": 5,
                "patient_id": 28,
                "disease_group_id": 12,
                "created_at": "2017-01-16T09:47:20.911Z",
                "updated_at": "2017-01-16T09:47:20.911Z"
            },
            "message": "Retrieved one patient disease group"
            }
        ]
        
### Update One Disease Group [PUT]
+ Request (application/json)

        {
            "patient_id":"12",
            "disease_group_id":"23"
        }
        
+ Response 200 (application/json)

        [
            {
            "status": "success",
            "message": "patient_disease_group data succesfully updated to db"
            }
        ]

### Delete Patient Disease Group [DELETE]
+ Response 200 (application/json)

        [
            {
              "status": "success",
              "message": "Removed 1 patient_disease_group"
            }
        ]
