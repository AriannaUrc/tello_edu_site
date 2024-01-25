@echo off
set SSID=TELLO-ED410E

echo Connessione alla rete WiFi %SSID%...

netsh wlan connect name=%SSID%

if %errorlevel% neq 0 (
    echo Errore durante la connessione a %SSID%.
) else (
    echo Connesso con successo a %SSID%.
)

