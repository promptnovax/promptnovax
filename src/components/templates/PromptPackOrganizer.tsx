import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy,
  Edit,
  Check,
  X,
  FileText,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface PromptPackItem {
  id: string
  title: string
  content: string
  order: number
}

interface PromptPackOrganizerProps {
  items: PromptPackItem[]
  onItemsChange: (items: PromptPackItem[]) => void
  readOnly?: boolean
}

export function PromptPackOrganizer({
  items: initialItems,
  onItemsChange,
  readOnly = false
}: PromptPackOrganizerProps) {
  const [items, setItems] = useState<PromptPackItem[]>(initialItems)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingContent, setEditingContent] = useState("")
  const { success } = useToast()

  const handleAddItem = () => {
    const newItem: PromptPackItem = {
      id: `item-${Date.now()}`,
      title: "New Prompt",
      content: "Enter your prompt content here...",
      order: items.length
    }
    const updated = [...items, newItem]
    setItems(updated)
    onItemsChange(updated)
    setEditingId(newItem.id)
    setEditingTitle(newItem.title)
    setEditingContent(newItem.content)
  }

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id).map((item, index) => ({
      ...item,
      order: index
    }))
    setItems(updated)
    onItemsChange(updated)
    success("Deleted", "Prompt removed from pack")
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...items]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    updated.forEach((item, i) => {
      item.order = i
    })
    setItems(updated)
    onItemsChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return
    const updated = [...items]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    updated.forEach((item, i) => {
      item.order = i
    })
    setItems(updated)
    onItemsChange(updated)
  }

  const handleStartEdit = (item: PromptPackItem) => {
    setEditingId(item.id)
    setEditingTitle(item.title)
    setEditingContent(item.content)
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    const updated = items.map(item =>
      item.id === editingId
        ? { ...item, title: editingTitle, content: editingContent }
        : item
    )
    setItems(updated)
    onItemsChange(updated)
    setEditingId(null)
    setEditingTitle("")
    setEditingContent("")
    success("Saved", "Prompt updated")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
    setEditingContent("")
  }

  const handleCopyItem = (content: string) => {
    navigator.clipboard.writeText(content)
    success("Copied", "Prompt copied to clipboard")
  }

  const handleCopyAll = () => {
    const allContent = items
      .sort((a, b) => a.order - b.order)
      .map((item, index) => `# ${item.title}\n\n${item.content}`)
      .join("\n\n---\n\n")
    navigator.clipboard.writeText(allContent)
    success("Copied", "All prompts copied to clipboard")
  }

  if (items.length === 0 && readOnly) {
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prompt Pack ({items.length} prompts)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {readOnly 
                ? "Complete prompt pack for this template"
                : "Organize multiple prompts in order of use"
              }
            </p>
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyAll}
                disabled={items.length === 0}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No prompts in this pack yet.</p>
            {!readOnly && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Prompt
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4"
                >
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Prompt title"
                      />
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        placeholder="Prompt content"
                        className="w-full min-h-[100px] p-2 border rounded-md resize-y"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Step {index + 1}
                            </Badge>
                            <h4 className="font-semibold">{item.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {item.content}
                          </p>
                        </div>
                        {!readOnly && (
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === items.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleCopyItem(item.content)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleStartEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

