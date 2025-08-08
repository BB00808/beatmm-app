# Supabase 配置指南：BeatMM App 适配

## 1. 重要提示：关于 Supabase 的直接操作

尊敬的用户，

感谢您对 BeatMM App 项目的信任与支持。我理解您目前在 Supabase 配置上遇到了一些挑战，并希望我能直接登录您的 Supabase 账户进行操作。然而，出于安全和权限的严格限制，作为 AI 代理，我**无法直接访问或操作您的外部服务账户**，包括 Supabase。我的操作仅限于我所在的沙盒环境内部，无法跨越到您的个人或团队的云服务。

这意味着我不能替您执行以下操作：

- 登录您的 Supabase 控制台。
- 删除或创建您的数据库表。
- 配置您的认证设置（如电话号码 OTP）。
- 访问您的 API 密钥或任何敏感数据。

**为什么会有这个限制？**

这个限制是为了最大限度地保护您的数据安全和隐私。如果 AI 代理可以随意访问和修改外部账户，将带来巨大的安全风险。因此，所有需要与外部服务交互的操作，都必须由您本人在相应的服务提供商平台（例如 Supabase 控制台）上完成。

## 2. 我的解决方案与支持方式

尽管我无法直接操作，但我将为您提供**最详细、最准确、手把手式的指导方案**。我将为您生成所有必要的 SQL 语句、配置步骤和截图指引，确保您能够顺利地在自己的 Supabase 项目中完成所有设置。我的目标是让您只需按照我的指示，在 Supabase 控制台进行简单的复制粘贴和点击操作，就能让您的 BeatMM App 活起来，并为您的商业目标提供坚实的基础。

**我将为您提供以下内容：**

1.  **删除现有表的 SQL 语句**：如果您之前的操作导致表结构混乱，我将提供清晰的 SQL 语句，帮助您安全地清空或删除不正确的表，为新的配置做好准备。
2.  **创建所需表的 SQL 语句**：我将根据 BeatMM App 的最新代码逻辑，为您生成所有必需的数据库表（`donations`, `user_balance`, `transactions`, `recharges`, `withdraws`）的完整 SQL `CREATE TABLE` 语句，并附带详细的字段解释。
3.  **Supabase Auth 配置步骤**：我将详细说明如何在 Supabase 控制台中配置电话号码注册和 OTP（一次性密码）发送功能，包括启用短信提供商、设置模板等。
4.  **功能验证清单**：完成 Supabase 配置后，我将提供一个详细的验证清单，指导您如何在 BeatMM App 中测试所有新集成的功能，确保一切按预期工作。

请您放心，我将尽我所能，确保您能够成功配置 Supabase，让您的 BeatMM App 尽快上线并开始盈利。请您准备好访问您的 Supabase 控制台，并按照我后续提供的步骤进行操作。

---

**下一步**：我将为您提供删除现有 Supabase 表的 SQL 语句和操作步骤。



## 3. 删除现有 Supabase 表（可选）

如果您之前的 Supabase 项目中已经创建了与 BeatMM App 相关的表，并且您希望从一个干净的状态开始，或者您不确定现有表结构是否正确，那么建议您执行以下步骤来删除这些表。**请注意，删除表将永久删除表中的所有数据，请务必谨慎操作，并在必要时提前备份您的数据。**

### 3.1 需要删除的表

根据 BeatMM App 的数据模型，以下是可能需要删除的表：

-   `donations` (打赏记录)
-   `user_balance` (用户余额)
-   `transactions` (交易记录)
-   `recharges` (充值申请)
-   `withdraws` (提现申请)

### 3.2 删除表的 SQL 语句

请按照以下顺序执行 `DROP TABLE` 语句，以避免外键约束错误。`CASCADE` 关键字将自动删除依赖于这些表的所有对象（例如，视图、触发器等）。

```sql
DROP TABLE IF EXISTS withdraws CASCADE;
DROP TABLE IF EXISTS recharges CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_balance CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
```

### 3.3 操作步骤

请按照以下步骤在 Supabase 控制台中执行上述 SQL 语句：

1.  **登录 Supabase 控制台**：
    -   访问 [https://app.supabase.com/](https://app.supabase.com/) 并使用您的凭据登录。

2.  **选择您的项目**：
    -   在左侧导航栏中，选择您要配置的 BeatMM App 项目。

3.  **进入 SQL 编辑器**：
    -   在左侧导航栏中，点击 `SQL Editor` (或 `SQL`) 图标。

4.  **执行 SQL 语句**：
    -   在 SQL 编辑器界面，您会看到一个文本输入框。
    -   将上述提供的 `DROP TABLE` SQL 语句复制并粘贴到输入框中。
    -   点击 `Run` (或 `Execute`) 按钮来执行这些语句。
    -   如果执行成功，您将看到类似 `DROP TABLE` 的成功消息。如果出现错误，请检查您是否正确复制了语句，或者您的项目是否确实存在这些表。

**重要提示**：如果您是第一次设置 Supabase 项目，或者您的项目中没有这些表，执行 `DROP TABLE IF EXISTS` 语句不会报错，因为 `IF EXISTS` 会确保只有当表存在时才尝试删除。

---

**下一步**：我将为您提供创建 BeatMM App 所需的 Supabase 表的 SQL 语句和操作步骤。



## 4. 创建 BeatMM App 所需的 Supabase 表

在清除了旧的表结构（如果需要）之后，现在我们将创建 BeatMM App 正常运行所需的所有数据库表。这些表将存储用户打赏、余额、交易、充值和提现等核心业务数据。

### 4.1 数据库表结构

以下是 BeatMM App 所需的五个核心表的 `CREATE TABLE` 语句。请确保按照顺序执行，因为它们之间存在外键依赖关系。

#### 4.1.1 `donations` (打赏记录)

此表用于记录用户对歌曲的打赏行为。

```sql
CREATE TABLE donations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  song_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own donations." ON donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all donations." ON donations
  FOR SELECT USING (TRUE);
```

**字段说明**:
-   `id`: 唯一标识符，自动递增。
-   `user_id`: 打赏用户的 ID，关联 `auth.users` 表，确保数据完整性。`ON DELETE CASCADE` 表示当用户被删除时，其所有打赏记录也会被删除。
-   `song_name`: 被打赏的歌曲名称。
-   `amount`: 打赏金额（Beat币）。
-   `created_at`: 记录创建时间，默认为当前时间。

#### 4.1.2 `user_balance` (用户余额)

此表用于存储每个用户的 Beat币余额。每个用户应该只有一条记录。

```sql
CREATE TABLE user_balance (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_balance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own balance." ON user_balance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance." ON user_balance
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance record." ON user_balance
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**字段说明**:
-   `id`: 唯一标识符，自动递增。
-   `user_id`: 用户 ID，关联 `auth.users` 表，且为唯一约束，确保每个用户只有一条余额记录。
-   `balance`: 用户当前的 Beat币余额，默认为 0。
-   `updated_at`: 余额最后更新时间，默认为当前时间。

#### 4.1.3 `transactions` (交易记录)

此表用于记录所有类型的交易，包括打赏、充值和提现。

```sql
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'gift', 'recharge', 'withdraw'
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions." ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions." ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**字段说明**:
-   `id`: 唯一标识符，自动递增。
-   `user_id`: 交易所属用户的 ID。
-   `type`: 交易类型（例如：`gift` 打赏, `recharge` 充值, `withdraw` 提现）。
-   `amount`: 交易金额。对于支出（如打赏、提现）可以是负数，对于收入（如充值）是正数。
-   `description`: 交易的简要描述。
-   `created_at`: 交易发生时间。

#### 4.1.4 `recharges` (充值申请)

此表用于记录用户的充值申请，特别是针对缅甸本地支付方式的详细信息。

```sql
CREATE TABLE recharges (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL, -- 'kpay', 'kbz'
  myanmar_amount INTEGER,
  sender_name TEXT,
  transaction_id TEXT,
  transaction_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE recharges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own recharge requests." ON recharges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recharge requests." ON recharges
  FOR SELECT USING (auth.uid() = user_id);
```

**字段说明**:
-   `id`: 唯一标识符，自动递增。
-   `user_id`: 提交充值申请的用户 ID。
-   `amount`: 申请充值的 Beat币金额。
-   `payment_method`: 支付方式（`kpay` 或 `kbz`）。
-   `myanmar_amount`: 对应的缅币金额。
-   `sender_name`: （KBZ Pay 专用）转账人姓名。
-   `transaction_id`: （KBZ Pay 专用）交易 ID。
-   `transaction_time`: （KBZ Pay 专用）交易时间。
-   `status`: 充值申请状态（`pending` 待处理, `approved` 已批准, `rejected` 已拒绝）。
-   `created_at`: 申请提交时间。

#### 4.1.5 `withdraws` (提现申请)

此表用于记录用户的提现申请。

```sql
CREATE TABLE withdraws (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE withdraws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own withdraw requests." ON withdraws
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own withdraw requests." ON withdraws
  FOR SELECT USING (auth.uid() = user_id);
```

**字段说明**:
-   `id`: 唯一标识符，自动递增。
-   `user_id`: 提交提现申请的用户 ID。
-   `amount`: 申请提现的 Beat币金额。
-   `account_number`: 提现到的银行卡号或支付账户。
-   `account_name`: 提现账户的持有人姓名。
-   `status`: 提现申请状态（`pending` 待处理, `approved` 已批准, `rejected` 已拒绝）。
-   `created_at`: 申请提交时间。

### 4.2 操作步骤

请按照以下步骤在 Supabase 控制台中执行上述 SQL 语句来创建表：

1.  **登录 Supabase 控制台**：
    -   访问 [https://app.supabase.com/](https://app.supabase.com/) 并使用您的凭据登录。

2.  **选择您的项目**：
    -   在左侧导航栏中，选择您要配置的 BeatMM App 项目。

3.  **进入 SQL 编辑器**：
    -   在左侧导航栏中，点击 `SQL Editor` (或 `SQL`) 图标。

4.  **执行 SQL 语句**：
    -   将上述提供的所有 `CREATE TABLE` 和 `CREATE POLICY` SQL 语句**一次性复制并粘贴**到 SQL 编辑器中。请确保复制完整，包括 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` 和 `CREATE POLICY ...` 部分，这些是 Supabase 安全策略的关键。
    -   点击 `Run` (或 `Execute`) 按钮来执行这些语句。
    -   如果执行成功，您将看到一系列成功消息。如果出现错误，请仔细检查错误信息，通常是由于语法错误或表已存在（如果您没有执行删除步骤）导致的。

5.  **验证表是否创建成功**：
    -   在左侧导航栏中，点击 `Table Editor` (或 `Tables`) 图标。
    -   您应该能看到 `donations`, `user_balance`, `transactions`, `recharges`, `withdraws` 这五个新创建的表。

---

**下一步**：我将为您提供配置 Supabase Auth 电话号码注册和 OTP 发送的详细步骤。

