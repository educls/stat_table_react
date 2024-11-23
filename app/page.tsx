
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import NaoAgrupadoTab from "@/app/pages/nao-agrupado/page"
import AgrupadoTab from "@/app/pages/agrupado/page"
import ClasseTab from "@/app/pages/classe/page"

export default function Home() {
  return (
    <div className="flex justify-center w-full h-full bg-gray-300 overflow-auto">
      <Tabs defaultValue="classe" className="flex flex-col w-full mt-5 pb-20 mx-2 sm:w-[60%]">
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
    </div>
  );
}
