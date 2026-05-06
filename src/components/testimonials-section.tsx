import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Андрей Смирнов",
    role: "Владелец мебельного магазина",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Пользуемся каждую неделю для доставки мебели клиентам. Грузчики — профессионалы, ни царапины за полгода работы.",
  },
  {
    name: "Елена Козлова",
    role: "Частный клиент, переезд",
    avatar: "/professional-woman-scientist.png",
    content:
      "Переезжала со всем имуществом. Рассчитала стоимость на сайте, заказала — приехали вовремя. Рекомендую всем!",
  },
  {
    name: "Дмитрий Петров",
    role: "Руководитель склада, ООО «СнабТех»",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Закрываем все логистические задачи через этот сервис. Счёт для юрлиц, документы в порядке — идеально для бизнеса.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Нам доверяют клиенты</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Более 5 000 выполненных перевозок — вот что говорят те, кто уже работает с нами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
