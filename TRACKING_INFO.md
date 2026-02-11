# Hexa Tracking & Leaderboard

## GPS Tracking

### How It Works
- Uses `navigator.geolocation.watchPosition()` for continuous GPS tracking
- Updates every 5-10 seconds based on device GPS
- Tracks both **running** and **cycling** (any movement)

### Activity Modes
1. **FOOT** (Walking/Running)
   - Distance gain: 0.01 km per hex
   - Normal energy consumption
   - Best for precise territory control

2. **CAVALRY** (Cycling/Driving)
   - Distance gain: 0.02 km per hex
   - Faster territory capture
   - Speed limit: 8.3 m/s (30 km/h, passive mode above this)

### Speed Detection
- Calculates speed between GPS points using Haversine formula
- Displays speed in m/s for accuracy (walking speed: 1-2 m/s, running: 3-4 m/s)
- If speed > 8.3 m/s → Passive mode (no territory capture)
- Prevents cheating via cars/trains

### Run Tracking System
- **Start Run**: Creates run session with timestamp
- **Track Points**: Records GPS coordinates every update (accuracy < 50m)
- **Calculate Distance**: Uses Haversine formula between points
- **Stop Run**: Calculates total distance and saves to database

## Leaderboard

### Global Leaderboard
- Ranks all players worldwide
- Sorted by: Hexes captured → XP points
- Updates in real-time
- Shows top 50 players

### Stats Tracked
- **Hexes Captured**: Total territories owned
- **Experience Points**: From capturing/reinforcing hexes
- **Total Distance**: Cumulative distance traveled
- **Level**: Calculated from XP (Level = XP / 100)
- **Faction**: Team affiliation

### Ranking System
1. **#1 Gold** - Reigning Emperor
2. **#2 Silver** - Silver Tier
3. **#3 Bronze** - Bronze Tier
4. **#4-50** - Elite Vanguard

## Does It Track Properly?

✅ **YES** - The system tracks:
- Walking/Running accurately via GPS
- Cycling (up to 30 km/h / 8.3 m/s)
- Real-time distance calculation
- Hex capture based on physical location
- Speed validation to prevent cheating

❌ **Limitations**:
- GPS accuracy varies (5-50 meters)
- Requires screen to stay on (Wake Lock API)
- Battery intensive
- Needs HTTPS for GPS access
- Speed > 8.3 m/s (30 km/h) = passive mode (no capture)

## API Endpoints

### Tracking
- `POST /api/run/start` - Start tracking session
- `POST /api/run/point` - Record GPS point
- `POST /api/run/stop` - End session & calculate distance

### Leaderboard
- `GET /api/leaderboard/global` - Global rankings
- `GET /api/leaderboard/local/:region` - Regional rankings

### Stats
- `GET /api/stats/:userId` - User statistics
- `GET /api/map/:userId` - User's captured hexes
