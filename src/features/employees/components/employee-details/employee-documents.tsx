import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

const documents = [
  { id: 1, name: "Employment Contract.pdf", date: "2023-01-15", size: "2.4 MB" },
  { id: 2, name: "Q1 Performance Review.pdf", date: "2025-04-10", size: "1.1 MB" },
  { id: 3, name: "NDA Signed.pdf", date: "2023-01-15", size: "0.8 MB" },
  { id: 4, name: "Direct Deposit Form.pdf", date: "2023-01-16", size: "0.5 MB" },
]

export function EmployeeDocuments() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Files and paperwork associated with this employee.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">Uploaded on {doc.date} • {doc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
