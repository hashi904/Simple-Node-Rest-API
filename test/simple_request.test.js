const request = require('supertest');
const server = require('../index');
let token;
let last_record_id;
// テストが終了したら、サーバをクローズする
afterAll(() => {
    'use strict';
    server.close();
});

describe('example.jsのリクエストのテスト', () => {
    'use strict';
    beforeAll((done) => {
        request(server)
        .post('/user_authentication')
        .send({"user": "user0","pass": "pass0"})
        .end((err, response) => {
            token = response.body.token; // save the token!
            done();
        });
    });

    describe('正常系テスト', () => {
        it('ログイン',async ()=>{
            const user = {"user": "user0","pass": "pass0"};
            const res = await request(server).post('/user_authentication').send(user);
            expect(res.status).toBe(200);
        });

        it('データ取得',async ()=>{
            const res = await request(server)
            .get('/example')
            .set('Authorization', `Bearer ${token}`);
            last_record_id = res.body[res.body.length-1].id; // save the last record id
            expect(res.status).toBe(200);
            expect(res.type).toBe('application/json');
        });

        it('データの送信',async ()=>{
            const post_json = {"text": "test_text"};
            const res = await request(server)
            .post('/example')
            .set('Authorization', `Bearer ${token}`)
            .send(post_json);
            expect(res.status).toBe(201);
        });

        it('個別データの更新',async ()=>{
            const res = await request(server)
            .get(`/example/${last_record_id}`)
            .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('データの更新',async ()=>{
            const patch_json = {"text": "test_text_patch"};
            const res = await request(server)
            .patch(`/example/${last_record_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(patch_json);
            expect(res.status).toBe(201);
        });

        it('データの削除',async ()=>{
            const res = await request(server)
            .delete(`/example/${last_record_id}`)
            .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

    });

    describe('異常系テスト(異常データの送信)', () => {
        //patchテスト用にrecord idを取得
        beforeAll((done) => {
            request(server)
            .get('/example')
            .set('Authorization', `Bearer ${token}`)
            .end((err, response) => {
                last_record_id = response.body[response.body.length-1].id; // save the last record id
                done();
            });
        });

        it('間違ったユーザー名、パスワードを入れてログイン',async ()=>{
            const user = {"user": "user1","pass": "pass1"};
            const res = await request(server).post('/user_authentication').send(user);
            expect(res.status).toBe(401);
        });

        it('文字を空にしてデータを送信(post)',async ()=>{
            const post_json = {"text": ""};
            const res = await request(server)
            .post('/example')
            .set('Authorization', `Bearer ${token}`)
            .send(post_json);
            expect(res.status).toBe(400);
        });

        it('指定文字数を超えるデータを送信(post)',async ()=>{
            const post_json = {"text": "hoge_hoge_hoge_hoge_hoge_hoge_hogehoge_hoge_hoge"};
            const res = await request(server)
            .post('/example')
            .set('Authorization', `Bearer ${token}`)
            .send(post_json);
            expect(res.status).toBe(400);
        });

        it('文字を空にして更新データを送信(patch)',async ()=>{
            const post_json = {"text": ""};
            const res = await request(server)
            .patch(`/example/${last_record_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(post_json);
            expect(res.status).toBe(400);
        });

        it('指定文字数を超える更新データを送信(patch)',async ()=>{
            const post_json = {"text": "hoge_hoge_hoge_hoge_hoge_hoge_hogehoge_hoge_hoge"};
            const res = await request(server)
            .patch(`/example/${last_record_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(post_json);
            expect(res.status).toBe(400);
        });
    });
});