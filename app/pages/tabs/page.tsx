import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import NaoAgrupadoTab from "../nao-agrupado/page"
import AgrupadoTab from "../agrupado/page"
import ClasseTab from "../classe/page"

export function TabsStats() {
  return (
    <Tabs defaultValue="classe" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="classe">Classe</TabsTrigger>
        <TabsTrigger value="naoagrupado">Não Agrupado</TabsTrigger>
        <TabsTrigger value="agrupado">Agrupado</TabsTrigger>
      </TabsList>

      <TabsContent value="classe">
        <ClasseTab />
      </TabsContent>

      <TabsContent value="naoagrupado">
        <NaoAgrupadoTab />
      </TabsContent>

      <TabsContent value="agrupado">
        <AgrupadoTab />
      </TabsContent>

    </Tabs>
  )
}
