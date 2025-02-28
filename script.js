document.addEventListener("DOMContentLoaded", () => {
    const prayerTimesElement = document.getElementById("prayer-times");
    const locationElement = document.getElementById("location");
    const adhanAudio = document.getElementById("adhan");
    const playAdhanButton = document.getElementById("play-adhan");

    // الحصول على الموقع الجغرافي للمستخدم
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            locationElement.textContent = `الموقع المحدد: (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
            
            // جلب مواقيت الصلاة من API
            fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`)
                .then(response => response.json())
                .then(data => {
                    const timings = data.data.timings;
                    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
                    
                    prayerTimesElement.innerHTML = "";
                    prayers.forEach(prayer => {
                        const row = document.createElement("tr");
                        row.innerHTML = `<td>${prayer}</td><td>${timings[prayer]}</td>`;
                        prayerTimesElement.appendChild(row);
                        
                        // التحقق من وقت الصلاة لتشغيل الأذان
                        checkPrayerTime(prayer, timings[prayer]);
                    });
                });
        }, () => {
            locationElement.textContent = "تعذر الحصول على الموقع.";
        });
    } else {
        locationElement.textContent = "المتصفح لا يدعم تحديد الموقع.";
    }

    // زر تشغيل الأذان
    playAdhanButton.addEventListener("click", () => {
        adhanAudio.play();
    });

    // تشغيل الأذان عند دخول وقت الصلاة
    function checkPrayerTime(prayer, time) {
        const now = new Date();
        const [hours, minutes] = time.split(":");
        const prayerTime = new Date();
        prayerTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

        if (now.getHours() === prayerTime.getHours() && now.getMinutes() === prayerTime.getMinutes()) {
            adhanAudio.play();
        }
    }

    // تحديث كل دقيقة للتحقق من وقت الأذان
    setInterval(() => {
        const now = new Date();
        console.log(`Checking prayer time at ${now.getHours()}:${now.getMinutes()}`);
    }, 60000);
});
