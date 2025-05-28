const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const APP_ID = 'ab39965c3627442e8d8bf38a47c911d2';
const APP_CERTIFICATE = 'f08f35dfa5b74ece8f61036f0a1887e4';

class Call {
    generateToken(uid, channelName, role = RtcRole.PUBLISHER) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expireTimestamp = currentTimestamp + (24 * 60 * 60); // 24 giờ

        return RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channelName,
            uid,
            role,
            expireTimestamp
        );
    }

    async call_start({ fromUserId, toUserId }) {
        const timestamp = Date.now();
        const channelName = `call_${fromUserId}_${timestamp}`;

        const fromUid = fromUserId;
        const fromToken = this.generateToken(fromUid, channelName);

        if (Array.isArray(toUserId)) {
            const toUsers = toUserId.map(uid => ({
                uid,
                token: this.generateToken(uid, channelName)
            }));

            return {
                channelName,
                from: { uid: fromUid, token: fromToken },
                to: toUsers
            };
        } else {
            const toUid = toUserId;
            const toToken = this.generateToken(toUid, channelName);

            return {
                channelName,
                from: { uid: fromUid, token: fromToken },
                to: { uid: toUid, token: toToken }
            };
        }
    }
}

module.exports = new Call();
