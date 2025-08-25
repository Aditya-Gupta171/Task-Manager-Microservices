import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl text-center font-bold tracking-tight">
          Organize your tasks efficiently
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          A lightweight productivity app. Create tasks, mark them complete, and stay focused.
        </p>
        <div className="flex gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <Feature
          title="Fast"
          desc="Optimized microservice backend with caching."
        />
        <Feature
          title="Secure"
          desc="JWT auth and isolated service data."
        />
        <Feature
          title="Responsive"
          desc="Clean UI built with Tailwind + shadcn."
        />
      </section>
    </div>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}