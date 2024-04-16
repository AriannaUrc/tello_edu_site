@echo off
set SSID=TELLO-ED4072

echo Connessione alla rete WiFi %SSID%...

netsh wlan connect name=%SSID%

if %errorlevel% neq 0 (
    echo Errore durante la connessione a %SSID%.
) else (
    echo Connesso con successo a %SSID%.
)

