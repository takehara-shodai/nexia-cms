SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '5cd99fb9-a06e-4390-868e-8d801e42791f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test@example.com","user_id":"3c32dfad-a7aa-4070-bcf0-362a3ea32b31","user_phone":""}}', '2025-05-21 00:22:53.258409+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '3c32dfad-a7aa-4070-bcf0-362a3ea32b31', 'authenticated', 'authenticated', 'test@example.com', '$2a$10$kAP3u.40nbAYcGVcvdepTeczcamADdvI/yNrNyi62IN4RHB.2Haze', '2025-05-21 00:22:53.259747+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-05-21 00:22:53.253529+00', '2025-05-21 00:22:53.260268+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3c32dfad-a7aa-4070-bcf0-362a3ea32b31', '3c32dfad-a7aa-4070-bcf0-362a3ea32b31', '{"sub": "3c32dfad-a7aa-4070-bcf0-362a3ea32b31", "email": "test@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-05-21 00:22:53.257255+00', '2025-05-21 00:22:53.257282+00', '2025-05-21 00:22:53.257282+00', '126d36c6-3589-4214-9572-12dbe4977cfd');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



-- 
-- Note: Removed reference to nexia-cms-contents table
--



--
-- Data for Name: nexia_cms_content_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."nexia_cms_content_statuses" ("id", "name", "description", "created_at", "updated_at") VALUES
('f0a6c4b0-7c91-4d1a-9e3a-a3dd76c46fdb', 'draft', 'コンテンツの下書き状態', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00'),
('29a1739d-7e64-49c5-9840-9b07f718ccb3', 'review', 'レビュー待ちのコンテンツ', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00'),
('3f8a54b1-c337-4c42-9ec7-d429c41c75f7', 'published', '公開されているコンテンツ', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00'),
('5e622142-81b4-4879-ab30-5d522842c240', 'archived', 'アーカイブされたコンテンツ', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00');




--
-- Data for Name: nexia_cms_content_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."nexia_cms_content_types" ("id", "name", "description", "schema", "created_at", "updated_at") VALUES
('d7c21f40-3184-49a4-a85d-6c57f2e3754c', 'article', '記事タイプのコンテンツ', '{"fields": [{"name": "title", "type": "text", "required": true}, {"name": "content", "type": "richtext", "required": true}, {"name": "description", "type": "text", "required": false}]}', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00'),
('82bc5348-66d9-4f36-b3ea-7a7f2c07d9a3', 'report', 'レポートタイプのコンテンツ', '{"fields": [{"name": "title", "type": "text", "required": true}, {"name": "content", "type": "richtext", "required": true}, {"name": "summary", "type": "text", "required": true}]}', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00'),
('1fd78215-97c0-4cd9-b870-6f4d3c5f57cd', 'guide', 'ガイドタイプのコンテンツ', '{"fields": [{"name": "title", "type": "text", "required": true}, {"name": "content", "type": "richtext", "required": true}, {"name": "steps", "type": "array", "required": false}]}', '2025-05-21 09:00:00+00', '2025-05-21 09:00:00+00');



--
-- Data for Name: nexia_cms_contents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nexia_cms_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."nexia_cms_tags" ("id", "name", "color", "created_at", "tenant_id") VALUES
('e5c1cf0b-7b20-4c8e-a027-8b17a9c2140c', '技術', '#3b82f6', '2025-05-21 09:00:00+00', '00000000-0000-0000-0000-000000000000'),
('a2f7d9c1-5e48-4679-9b8d-3e8f67c4d2f5', 'マーケティング', '#10b981', '2025-05-21 09:00:00+00', '00000000-0000-0000-0000-000000000000'),
('7a1d43b8-3e9c-4f2a-b65c-92d5ea7e47c8', '新着', '#f59e0b', '2025-05-21 09:00:00+00', '00000000-0000-0000-0000-000000000000'),
('c6b8e2a5-1d7f-4d3c-9e0b-8f5a94c5d123', '重要', '#ef4444', '2025-05-21 09:00:00+00', '00000000-0000-0000-0000-000000000000'),
('9d4e1f2c-3b6a-47d8-a5e9-0c7f8d921a5b', 'イベント', '#8b5cf6', '2025-05-21 09:00:00+00', '00000000-0000-0000-0000-000000000000');



--
-- Data for Name: nexia_cms_content_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "name", "slug", "created_at") VALUES
('00000000-0000-0000-0000-000000000000', 'デフォルトテナント', 'default', '2025-05-22 09:00:00+00'),
('11111111-1111-1111-1111-111111111111', '開発テナント', 'development', '2025-05-22 09:00:00+00'),
('22222222-2222-2222-2222-222222222222', 'テストテナント', 'test', '2025-05-22 09:00:00+00');

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "first_name", "last_name", "display_name", "avatar_url", "created_at") VALUES
('3c32dfad-a7aa-4070-bcf0-362a3ea32b31', 'test@example.com', '太郎', '山田', '山田 太郎', 'https://api.dicebear.com/7.x/personas/svg?seed=yamada', '2025-05-22 09:00:00+00'),
('44444444-4444-4444-4444-444444444444', 'hanako@example.com', '花子', '佐藤', '佐藤 花子', 'https://api.dicebear.com/7.x/personas/svg?seed=hanako', '2025-05-22 09:00:00+00'),
('55555555-5555-5555-5555-555555555555', 'admin@example.com', '管理', '次郎', '管理者', 'https://api.dicebear.com/7.x/personas/svg?seed=admin', '2025-05-22 09:00:00+00');

--
-- Data for Name: user_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_tenants" ("user_id", "tenant_id", "role", "created_at") VALUES
('3c32dfad-a7aa-4070-bcf0-362a3ea32b31', '00000000-0000-0000-0000-000000000000', 'admin', '2025-05-22 09:00:00+00'),
('3c32dfad-a7aa-4070-bcf0-362a3ea32b31', '11111111-1111-1111-1111-111111111111', 'member', '2025-05-22 09:00:00+00'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'member', '2025-05-22 09:00:00+00'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'admin', '2025-05-22 09:00:00+00'),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'admin', '2025-05-22 09:00:00+00'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'admin', '2025-05-22 09:00:00+00');

--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."departments" ("id", "tenant_id", "name", "description", "parent_id", "path", "created_at", "updated_at") VALUES
('d1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '全社', '会社全体の部門', NULL, 'd1111111-1111-1111-1111-111111111111', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('d2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', '開発部', '開発部門', 'd1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111.d2222222-2222-2222-2222-222222222222', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('d3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', '営業部', '営業部門', 'd1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111.d3333333-3333-3333-3333-333333333333', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('d4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'フロントエンド開発', 'フロントエンド開発チーム', 'd2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111.d2222222-2222-2222-2222-222222222222.d4444444-4444-4444-4444-444444444444', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('d5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'バックエンド開発', 'バックエンド開発チーム', 'd2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111.d2222222-2222-2222-2222-222222222222.d5555555-5555-5555-5555-555555555555', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('d6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '開発部', '開発部門', NULL, 'd6666666-6666-6666-6666-666666666666', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00');

--
-- Data for Name: user_departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_departments" ("user_id", "department_id", "tenant_id") VALUES
('3c32dfad-a7aa-4070-bcf0-362a3ea32b31', 'd1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000'),
('3c32dfad-a7aa-4070-bcf0-362a3ea32b31', 'd4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000'),
('44444444-4444-4444-4444-444444444444', 'd3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000'),
('55555555-5555-5555-5555-555555555555', 'd1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000'),
('55555555-5555-5555-5555-555555555555', 'd6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111');

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "name", "description", "created_at", "updated_at") VALUES
('a1111111-1111-1111-1111-111111111111', '管理者', 'システム管理者ロール', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('b2222222-2222-2222-2222-222222222222', '編集者', 'コンテンツ編集者ロール', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('c3333333-3333-3333-3333-333333333333', '閲覧者', '閲覧のみ可能なロール', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00'),
('d4444444-4444-4444-4444-444444444444', '承認者', 'コンテンツ承認権限を持つロール', '2025-05-22 09:00:00+00', '2025-05-22 09:00:00+00');

--
-- Data for Name: role_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."role_tenants" ("role_id", "tenant_id", "created_at") VALUES
('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '2025-05-22 09:00:00+00'),
('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', '2025-05-22 09:00:00+00'),
('c3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', '2025-05-22 09:00:00+00'),
('d4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', '2025-05-22 09:00:00+00'),
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '2025-05-22 09:00:00+00'),
('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2025-05-22 09:00:00+00'),
('a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2025-05-22 09:00:00+00');

--
-- PostgreSQL database dump complete
--

RESET ALL;
