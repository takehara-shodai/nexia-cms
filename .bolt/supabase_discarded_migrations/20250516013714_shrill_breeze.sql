/*
  # 不要なtodosテーブルの削除

  1. 変更内容
    - todosテーブルの削除
    - 関連するトリガー関数の削除
  
  2. 理由
    - アプリケーションの要件に不要なテーブル
*/

-- トリガーの削除
DROP TRIGGER IF EXISTS update_todos_timestamp ON public.todos;

-- トリガー関数の削除
DROP FUNCTION IF EXISTS update_timestamp();

-- テーブルの削除
DROP TABLE IF EXISTS public.todos;