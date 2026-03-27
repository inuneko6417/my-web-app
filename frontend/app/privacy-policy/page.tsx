import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">プライバシーポリシー</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. 個人情報の収集について</h2>
        <p className="text-gray-700">
          当サービスでは、ユーザーがレシピ抽出機能を利用する際に、YouTubeの動画URLを収集します。これ以外の個人を特定できる情報（氏名、メールアドレスなど）は、ユーザーが明示的に提供しない限り収集しません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. 収集した情報の利用目的</h2>
        <p className="text-gray-700">
          収集したYouTube動画URLは、AIによるレシピの解析および抽出、そしてその結果をユーザーに提供するためにのみ利用します。それ以外の目的で利用することはありません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. 情報の共有と開示</h2>
        <p className="text-gray-700">
          当サービスは、ユーザーから収集した情報を、法律で義務付けられている場合を除き、ユーザーの同意なく第三者に開示または提供することはありません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. データセキュリティ</h2>
        <p className="text-gray-700">
          当サービスは、収集した情報の不正アクセス、紛失、破壊、改ざん、漏洩を防ぐため、適切なセキュリティ対策を講じています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. プライバシーポリシーの変更</h2>
        <p className="text-gray-700">
          当サービスは、必要に応じて本プライバシーポリシーを改定することがあります。改定されたプライバシーポリシーは、速やかに本ウェブサイトに掲載します。
        </p>
      </section>
      <p className="text-sm text-gray-500 mt-10 text-center">最終更新日: 2026年3月25日</p>
    </div>
  );
}
