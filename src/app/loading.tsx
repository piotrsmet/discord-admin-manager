import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-secondary animate-pulse rounded-md"></div>
        <div className="flex gap-4">
          <div className="h-9 w-32 bg-secondary animate-pulse rounded-md"></div>
          <div className="h-9 w-24 bg-secondary animate-pulse rounded-md"></div>
        </div>
      </div>

      <div className="h-4 w-64 bg-secondary animate-pulse rounded-md mb-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-primary/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-secondary animate-pulse rounded-md"></div>
                <div className="h-8 w-16 bg-secondary animate-pulse rounded-md"></div>
              </div>
              <div className="h-12 w-12 bg-secondary animate-pulse rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 h-[400px]">
          <CardHeader title="Loading..." description="" />
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-accent/30 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-secondary animate-pulse"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-1/2 bg-secondary animate-pulse rounded-md"></div>
                    <div className="h-3 w-1/3 bg-secondary animate-pulse rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-[400px]">
          <CardHeader title="Loading..." description="" />
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="w-48 h-48 rounded-full bg-secondary animate-pulse"></div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-[400px]">
          <CardHeader title="Loading..." description="" />
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-full bg-secondary animate-pulse rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="h-[400px]">
          <div className="h-full w-full bg-secondary animate-pulse rounded-md"></div>
        </Card>
      </div>
    </div>
  );
}