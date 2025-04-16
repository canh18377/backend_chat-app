// const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
// const APP_ID = 'ab39965c3627442e8d8bf38a47c911d2';
// const APP_CERTIFICATE = 'f08f35dfa5b74ece8f61036f0a1887e4';
// app.post('/api/call/start', (req, res) => {
//     const { fromUserId, toUserId } = req.body;

//     if (!fromUserId || !toUserId) {
//         return res.status(400).json({ message: 'Missing fromUserId or toUserId' });
//     }

//     const channelName = `call_${fromUserId}_${toUserId}_${Date.now()}`;
//     const uid = Math.floor(Math.random() * 100000);  // hoặc dùng từ UserID thực tế nếu có
//     const role = RtcRole.PUBLISHER;
//     const currentTimestamp = Math.floor(Date.now() / 1000);
//     const privilegeExpireTs = currentTimestamp + (24 * 60 * 60); // Token có hiệu lực trong 24 giờ

//     // Sinh token Agora
//     const token = RtcTokenBuilder.buildTokenWithUid(
//         APP_ID,
//         APP_CERTIFICATE,
//         channelName,
//         uid,
//         role,
//         privilegeExpireTs
//     );

//     // Trả token và channelName cho client
//     res.json({
//         channelName,
//         token,
//         uid,
//         appId: APP_ID,
//     });
// });
