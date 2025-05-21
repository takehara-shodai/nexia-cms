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
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- PostgreSQL database dump complete
--

RESET ALL;
