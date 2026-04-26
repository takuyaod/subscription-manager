import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Manager
          </h1>
          <p className="mt-2 text-muted-foreground">
            UIコンポーネントの動作確認ページ
          </p>
        </div>

        {/* Button variants */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Button</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Input */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Input</h2>
          <div className="space-y-2">
            <Input placeholder="サービス名を入力..." />
            <Input type="number" placeholder="月額料金..." />
            <Input disabled placeholder="無効状態" />
          </div>
        </section>

        {/* Card */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Card</h2>
          <Card>
            <CardHeader>
              <CardTitle>Netflix</CardTitle>
              <CardDescription>動画ストリーミングサービス</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                月額: ¥1,490 / 毎月15日更新
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">編集</Button>
              <Button size="sm" variant="outline">
                解約
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
