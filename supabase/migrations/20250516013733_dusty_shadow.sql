/*
  # todosテーブルの削除

  1. 変更内容
    - todosテーブルとそのポリシーを削除
    - 他のテーブルで使用されているupdate_timestamp関数は維持

  2. 注意事項
    - update_timestamp関数は他のテーブルのトリガーで使用されているため削除しない
*/

-- テーブルの削除（関連するポリシーは自動的に削除される）
DROP TABLE IF EXISTS public.todos;