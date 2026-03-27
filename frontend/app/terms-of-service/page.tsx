import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">利用規約</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. 本サービスの利用について</h2>
        <p className="text-gray-700">
          「RecipeTube」（以下、本サービス）は、YouTube動画のURLを入力することで、AIが動画からレシピの材料や分量を抽出するサービスです。本サービスを利用するユーザー（以下、利用者）は、本規約に同意したものとみなされます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. 禁止事項</h2>
        <p className="text-gray-700">
          利用者は、本サービスの利用にあたり、以下の行為を行ってはならないものとします。
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為</li>
          <li>本サービスの運営を妨害するおそれのある行為</li>
          <li>その他、本サービスが不適切と判断する行為</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. 免責事項</h2>
        <p className="text-gray-700">
          本サービスは、提供する情報について、その正確性、完全性、有用性を保証するものではありません。利用者が本サービスを利用したことによって生じた損害については、一切の責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. 著作権について</h2>
        <p className="text-gray-700">
          本サービスを通じて提供されるコンテンツ（レシピ情報など）の著作権は、各YouTube動画の投稿者または正当な権利者に帰属します。利用者は、これらのコンテンツを著作権法で認められた範囲でのみ利用するものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. サービス内容の変更等</h2>
        <p className="text-gray-700">
          本サービスは、利用者に通知することなく、本サービスの内容を変更し、または本サービスの提供を中止することができるものとし、これによって利用者に生じた損害について一切の責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. 利用規約の変更</h2>
        <p className="text-gray-700">
          本サービスは、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. 準拠法・裁判管轄</h2>
        <p className="text-gray-700">
          本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、本サービス提供者の所在地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-10 text-center">最終更新日: 2026年3月25日</p>
    </div>
  );
}
