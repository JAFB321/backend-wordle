## Woordle Backend

A continuación se describe el funcionamiento basico de la aplicacion:

#### 1.- Ingresar variables de entorno en archivo .env
```bash
PORT=3000
JWT_SECRET=12345

# PostreSQL DB
PGHOST=localhost
PGUSER=postgres
PGDATABASE=wordle
PGPASSWORD=12345
PGPORT=5432
```

#### 2.- Inicializar base de datos
```bash
npm run createdb
```
Esperar a que el comando imprima lo siguiente:
```bash
{
  message: 'Database created successfuly',
  dbname: 'wordle',
  tables: [ 'users', 'dictionary', 'selectedWords', 'userGames' ],
  user1: { username: 'user', password: '12345' },
  user2: { username2: 'player', password2: '12345' }
}
```

Por defecto se crean 2 usuarios de ejemplo que serviran para jugar al juego

#### 3.- Iniciar el programa
```bash
npm start
```
Al comenzar iniciara el servidor HTTP e imprimira la palabra inicial, que se actualizara cada 5 minutos
```bash
Server listening on port 3000
guste
```

#### 4.- Hacer login con un usuario de ejemplo
```bash
POST /api/login
{
    "user": "player",
    "password": "12345"   
}
```
Esto retornara el token de autenticación que sera necesario enviar en las proximas llamadas a las rutas de la API (como Bearer token):
```bash
{
    "logged": true,
    "token": "tu token",
    "userid": 2
}
```

#### 5.- Obtener la sesion de juego del jugador
```bash
GET /api/user/:userId/game
```
Que responde con la sesion de juego actual del jugador:
```bash
{
    "gameId": 1,
    "attemps": 0,
    "state": "progress"
}
```

#### 6.- Hacer intentos para adivinar la palabra
```bash
POST /api/game/:gameId/attemp
{
    "user_word": "GATOS"
}
```
Esto respondera con un arreglo describiendo el acierto de cada letra:
```bash
{
    "state": "progress",
    "coincidences": [
        {
            "letter": "G",
            "value": 1
        },
        {
            "letter": "A",
            "value": 3
        },
        {
            "letter": "T",
            "value": 2
        },
        {
            "letter": "O",
            "value": 3
        },
        {
            "letter": "S",
            "value": 2
        }
    ]
}
```
Donde:
- Si la letra ingresada está en el mismo lugar, regresará un 1
- Si la letra ingresada está en la palabra pero no en el mismo lugar, regresará la letra con un 2 
- Si la letra ingresada no se encuentra en la palabra, regresará la letra con un 3

Si se intenta de nuevo una vez que el usuario ya ha ganado/perdido este endpoint retornara un error.

### Reportes
##### Obtener cuantas partidas a jugado un usuario y cuantas victorias ha tenido
```bash
GET api/reports/user/:userId
```

##### Obtener los mejores 10 jugadores con su número de victorias
```bash
GET api/reports/top-players
```

##### Obtener las palabras más acertadas
```bash
GET api/reports/top-words
```