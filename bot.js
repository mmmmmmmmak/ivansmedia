const { HearManager } = require('@vk-io/hear');
const { QuestionManager } = require('vk-io-question');
const {VK, resolveResource, API, getRandomId, Keyboard, MessageForwardsCollection} = require('vk-io');
const { post } = require('request');

const vk = new VK({
    token: '64d54def091abf4c3b1d24341e258f5b701ca40156edc232a9264b0639affa706f97bbb33459c4dfb872c'
    // token: 'b79d783748e89e89eaef264a76e1c142702c66f6cd24bd8c3258f2da4015af94dc6fe8678aebc14cb94a7'
});

const { api, updates, snippets } = vk

const questionManager = new QuestionManager();
const cmd = new HearManager();
const commands = [];

vk.updates.use(questionManager.middleware);
vk.updates.on('message_new' , cmd.middleware)

cmd.hear(/^hello$/, async (context) => {
await context.send('Hello!');
});

console.log('Поехали!')
vk.updates.start()

async function getVkNameById(id) {
    const [data] = await api.users.get({
      user_ids: id,
    });
    return data.first_name;
  } 

  let groups = ['https://vk.com/ivansmedia']
  let groupsnum = [211145670]

  cmd.hear(/^(?:Начать)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
        msg.send(
            `Привет, ${name}, вот мои функции:`,
            { 
                keyboard: JSON.stringify( 
                { 
                "one_time": false,
                "buttons": [ 
                [{ 
                "action": { 
                "type": "text", 
                "payload": "{\"button\": \"1\"}", 
                "label": "Хочу узнать новых друзей" 
                }, 
                "color": "positive" 
                }],
            ]
            })
        }
        )
    }
})

cmd.hear(/^(?:Хочу узнать новых друзей)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
        msg.send(
            `Спасибо за участие , ${name}, вот друзья: ${groups.join('\n')}`
            ,
            { 
                keyboard: JSON.stringify( 
                { 
                "one_time": false,
                "buttons": [ 
                [{ 
                "action": { 
                "type": "text", 
                "payload": "{\"button\": \"1\"}", 
                "label": "Все друзья у меня." 
                }, 
                "color": "positive" 
                }],
            ]
            })
        })
    }
})

cmd.hear(/^(?:добавить группу)$/i, async (msg) => {
    if (!msg.isChat) {
        const answ = await msg.question(`Введите полную ссылку группы (формат https://vk.com/123):`)
        if(answ.text.includes(`https://vk.com`)) {
             msg.send(`Отлично! Полная ссылка добавлена в массив.`)
             groups.push(answ.text)
             const answer = await msg.question(`Введите цифры от начального айди группы (получить можно здесь: https://regvk.com/id/):`)
                if (/[a-zA-Z]/.test(answer.text)){
                    msg.send(`Формат неверный! Выполните данную команду снова.`)
                }
                else {
                    groupsnum.push(Number(answer.text))
                return msg.send(`Всё получилось! Цифровое айди добавлено в список.`)
        }
        }
        else if(!answ.text.includes(`https://vk.com`)) {
            return msg.send(`Формат ссылки неверный. Повторите данную команду снова!`)
        }
    }
})

cmd.hear(/^(?:проверить группы)$/i, async (msg) => {
    if (!msg.isChat) {
        const answer = await msg.question(`Введите цифры от начального айди пользователя (получить можно здесь: https://regvk.com/id/):`)
        let otpr = 0
        let unsub = 0
        groupsnum.forEach((item, index, array) => {
            vk.api.groups.isMember({
            user_id: answer.text,
            group_id: item,
        }).then(function(res) {
            console.log(res)
            if(res < 1) {
                unsub = 1
                msg.send(`Ошибка! Пользователь не подписался на группу: vk.com/club${item}.`)
            }
            else if (res > 0) {
                if(otpr == 0 && unsub == 0) {
                    otpr = 1
                    return msg.send(`Проверяю... (если я не напишу об ошибке, то все проверки пройдены!)`)
                }
            }
        })})
    }
})
