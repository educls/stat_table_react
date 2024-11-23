
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import NaoAgrupadoTab from "../nao-agrupado/page"
import AgrupadoTab from "../agrupado/page"
import ClasseTab from "../classe/page"

export default function TabsStats() {
  return (
    <Tabs defaultValue="classe" className="flex flex-col w-full mt-5 sm:w-[60%]">
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
